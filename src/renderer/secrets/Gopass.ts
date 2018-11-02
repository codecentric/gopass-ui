import { exec } from 'child_process'

export interface HistoryEntry {
    hash: string
    author: string
    timestamp: string
    message: string
}

const lineSplitRegex = /\r?\n/
const isDefined = (value: string) => !!value
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

    private static async execute(command: string, args?: string[]): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const argsString = args ? ` ${args.join(' ')}` : ''
            exec(
                `gopass ${command}${argsString}`,
                (err: Error | null, stdout: string, stderr: string) => {
                    if (err) {
                        reject(
                            new Error(`Stderr: ${stderr}, Error: ${err ? JSON.stringify(err) : ''}`)
                        )
                    } else {
                        resolve(stdout)
                    }
                }
            )
        })
    }
}
