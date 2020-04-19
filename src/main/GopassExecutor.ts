import { exec } from 'child_process'
import { IpcMainEvent } from 'electron'

export interface GopassOptions {
    executionId: string
    command: string
    pipeTextInto?: string
    args?: string[]
}

export default class GopassExecutor {
    public static async handleEvent(event: IpcMainEvent, options: GopassOptions) {
        const argsString = options.args ? ` ${options.args.join(' ')}` : ''
        const pipeText = options.pipeTextInto ? `echo "${options.pipeTextInto}" | ` : ''
        const command = `${pipeText}gopass ${options.command}${argsString}`

        exec(command, (err: Error | null, stdout: string, stderr: string) => {
            event.sender.send(`gopass-answer-${options.executionId}`, {
                status: err ? 'ERROR' : 'OK',
                executionId: options.executionId,
                payload: err ? stderr : stdout
            })
        })
    }
}
