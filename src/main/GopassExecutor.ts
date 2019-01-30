import { exec } from 'child_process'
import { Event } from 'electron'

export interface GopassOptions {
    executionId: string
    command: string
    pipeTextInto?: string
    args?: string[]
}

export default class GopassExecutor {
    public static async handleEvent(event: Event, options: GopassOptions) {
        const argsString = options.args ? ` ${options.args.join(' ')}` : ''
        const pipeText = options.pipeTextInto ? `echo "${options.pipeTextInto}" | ` : ''

        exec(`${pipeText}gopass ${options.command}${argsString}`,
            (err: Error | null, stdout: string, stderr: string) => {
                event.sender.send(
                    `gopass-answer-${options.executionId}`,
                    {
                        status: err ? 'ERROR' : 'OK',
                        executionId: options.executionId,
                        payload: err ? stderr : stdout
                    }
                )
            }
        )
    }
}
