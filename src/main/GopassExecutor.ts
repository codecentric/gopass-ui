import { exec } from 'child_process'
import { Event, ipcMain } from 'electron'

export interface GopassOptions {
    executionId: string
    command: string
    args?: string[]
}

export default class GopassExecutor {
    public static async handleEvent(event: Event, options: GopassOptions) {
        const argsString = options.args ? ` ${options.args.join(' ')}` : ''

        exec(
            `gopass ${options.command}${argsString}`,
            (err: Error | null, stdout: string, stderr: string) => {
                if (err) {
                    event.sender.send(`gopass-answer-${options.executionId}`, new Error(`Stderr: ${stderr}, Error: ${err ? JSON.stringify(err) : ''}`))
                } else {
                    event.sender.send(`gopass-answer-${options.executionId}`, stdout)
                }
            }
        )
    }
}
