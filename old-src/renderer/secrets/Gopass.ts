import { ipcRenderer } from 'electron'

export interface HistoryEntry {
    hash: string
    author: string
    timestamp: string
    message: string
}

export interface Mount {
    name: string
    path: string
}

const lineSplitRegex = /\r?\n/
const isDefined = (value: string) => !!value
const escapeShellValue = (value: string) => value.replace(/(["'$`\\])/g, '\\$1')

export default class Gopass {
    public static executionId = 1

    public static async copy(key: string): Promise<string> {
        return Gopass.execute(`show -c "${escapeShellValue(key)}"`)
    }

    public static async show(key: string): Promise<string> {
        return Gopass.execute(`show -f "${escapeShellValue(key)}"`)
    }

    public static async history(key: string): Promise<HistoryEntry[]> {
        try {
            return (await Gopass.execute(`history "${escapeShellValue(key)}"`))
                .split(lineSplitRegex)
                .filter(isDefined)
                .map(historyLine => {
                    const lineSplit = historyLine.split(' - ')

                    return {
                        hash: lineSplit[0],
                        author: lineSplit[1],
                        timestamp: lineSplit[2],
                        message: lineSplit[3]
                    }
                })
        } catch {
            return []
        }
    }

    public static async getMyRecipientId(): Promise<string | undefined> {
        const recipientIdLine = (await Gopass.execute('recipients')).split(lineSplitRegex).find(line => line.includes('└──'))
        if (recipientIdLine) {
            const lineSplit = recipientIdLine.split(' ')
            return lineSplit[4].replace('0x', '')
        }
    }

    public static async getAllMounts(): Promise<Mount[]> {
        try {
            return (await Gopass.execute('mounts'))
                .split(lineSplitRegex)
                .filter(line => line.includes('└──') || line.includes('├──'))
                .map(mountLine => {
                    const lineSplit = mountLine.split(' ')

                    return {
                        name: lineSplit[1],
                        path: lineSplit[2].replace(/[{()}]/g, '')
                    }
                })
        } catch {
            return []
        }
    }

    public static async addMount(mount: Mount) {
        const myRecipientId = await Gopass.getMyRecipientId()
        if (myRecipientId) {
            const result = await Gopass.execute('mounts add', [
                `"${escapeShellValue(mount.name)}"`,
                `"${escapeShellValue(mount.path)}"`,
                `-i "${myRecipientId}"`
            ])
            if (result.includes('is already mounted')) {
                // tslint:disable-next-line
                throw 'duplicate-name'
            }
        } else {
            throw new Error('Own GPG recipient ID could not be determined')
        }
    }

    public static async deleteMount(name: string) {
        await Gopass.execute('mounts rm', [`"${escapeShellValue(name)}"`])
    }

    public static async sync(): Promise<void> {
        await Gopass.execute('sync')
    }

    public static async getAllSecretNames(): Promise<string[]> {
        const flatSecrets = await Gopass.execute('list', ['--flat'])

        return flatSecrets.split(lineSplitRegex).filter(isDefined)
    }

    public static async addSecret(name: string, value: string): Promise<void> {
        await Gopass.execute('insert', [`"${escapeShellValue(name.trim())}"`], escapeShellValue(value))
    }

    public static async editSecret(name: string, newValue: string): Promise<void> {
        await Gopass.execute('insert', ['--force', `"${escapeShellValue(name.trim())}"`], escapeShellValue(newValue))
    }

    public static async deleteSecret(name: string): Promise<void> {
        await Gopass.execute('rm', ['--force', `"${escapeShellValue(name)}"`])
    }

    private static execute(command: string, args?: string[], pipeTextInto?: string): Promise<string> {
        // tslint:disable-next-line

        const result = new Promise<string>((resolve, reject) => {
            ipcRenderer.once(`gopass-answer-${Gopass.executionId}`, (_: Event, value: any) => {
                if (value.status === 'ERROR') {
                    reject(value.payload)
                } else {
                    resolve(value.payload)
                }
            })
        })

        ipcRenderer.send('gopass', { executionId: Gopass.executionId, command, args, pipeTextInto })

        Gopass.executionId++

        return result
    }
}
