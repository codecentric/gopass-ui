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

export class Gopass {
    public static executionId = 1

    public static async copy(key: string): Promise<string> {
        return Gopass.execute(`show -c "${escapeShellValue(key)}"`)
    }

    public static async show(key: string): Promise<string> {
        return Gopass.execute(`show -f "${escapeShellValue(key)}"`)
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
