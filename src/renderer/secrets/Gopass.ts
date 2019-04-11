import { ipcRenderer } from 'electron'

export interface HistoryEntry {
    hash: string
    author: string
    timestamp: string
    message: string
}

const lineSplitRegex = /\r?\n/
const isDefined = (value: string) => !!value

let executionId = 1

export default class Gopass {
    public static async copy(key: string): Promise<string> {
        return Gopass.execute(`show ${key} -c`)
    }

    public static async show(key: string): Promise<string> {
        return Gopass.execute(`show ${key}`)
    }

    public static async history(key: string): Promise<HistoryEntry[]> {
        return (await Gopass.execute(`history ${key}`))
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
    }

    public static async sync(): Promise<void> {
        await Gopass.execute('sync')
    }

    public static async getAllSecretNames(): Promise<string[]> {
        const flatSecrets = await Gopass.execute('list', ['--flat'])

        return flatSecrets.split(lineSplitRegex).filter(isDefined)
    }

    public static async addSecret(name: string, value: string): Promise<void> {
        await Gopass.execute('insert', [ name ], value)
    }

    public static async editSecret(name: string, newValue: string): Promise<void> {
        await Gopass.addSecret(name, newValue)
    }

    private static execute(command: string, args?: string[], pipeTextInto?: string): Promise<string> {
        // tslint:disable-next-line
        executionId++

        const result = new Promise<string>((resolve, reject) => {
            ipcRenderer.once(`gopass-answer-${executionId}`, (_: Event, value: any) => {
                if (value.status === 'ERROR') {
                    reject(value.payload)
                } else {
                    resolve(value.payload)
                }
            })
        })

        ipcRenderer.send('gopass', { executionId, command, args, pipeTextInto })

        return result
    }
}
