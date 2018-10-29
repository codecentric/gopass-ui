import { exec } from 'child_process'

export default class Gopass {
    public static async show(key: string): Promise<string> {
        return Gopass.execute(`show ${key}`)
    }

    private static async execute(command: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            exec(`gopass ${command}`, (err: Error | null, stdout: string, stderr: string) => {
                if (err) {
                    reject(
                        new Error(`Stderr: ${stderr}, Error: ${err ? JSON.stringify(err) : ''}`)
                    )
                } else {
                    resolve(stdout)
                }
            })
        })
    }
}
