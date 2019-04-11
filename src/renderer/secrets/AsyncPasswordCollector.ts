import Gopass from './Gopass'
import { passwordSecretRegex } from './deriveIconFromSecretName'

export interface PasswordSecret {
    name: string
    value: string
    health?: number
    failedRulesCount?: number
}

export interface CollectionStatus {
    totalPasswords: number
    passwordsCollected: number
    inProgress: boolean
    passwords: PasswordSecret[]
    error: Error | undefined
}

export default class AsyncPasswordCollector {
    private status: CollectionStatus = {
        totalPasswords: 0,
        passwordsCollected: 0,
        inProgress: false,
        passwords: [],
        error: undefined
    }

    public async start() {
        const passwordSecretNames = await this.initializePasswordSecretNames(true)

        try {
            await this.collectPasswordsOneAfterAnother(passwordSecretNames)
            this.status.inProgress = false
        } catch (e) {
            this.status.error = e
            this.status.inProgress = false
        }
    }

    public async stopAndReset() {
        await this.initializePasswordSecretNames(false)
    }

    get getCurrentStatus(): CollectionStatus {
        return this.status
    }

    private async initializePasswordSecretNames(inProgress: boolean): Promise<string[]> {
        const passwordSecretNames = await this.getAllSecretsContainingPasswords()

        this.status.inProgress = inProgress
        this.status.passwords = []
        this.status.error = undefined
        this.status.totalPasswords = passwordSecretNames.length

        return passwordSecretNames
    }

    private async getAllSecretsContainingPasswords(): Promise<string[]> {
        const allSecretNames = await Gopass.getAllSecretNames()
        return allSecretNames.filter(secretName => passwordSecretRegex.test(secretName))
    }

    private collectPasswordsOneAfterAnother = async (passwordSecretNames: string[]) => {
        this.status.passwords = []

        // use for-loop to do only one Gopass lookup at a time
        for (const name of passwordSecretNames) {
            if (this.status.inProgress) {
                const value = await Gopass.show(name)

                this.status.passwords.push({ name, value })
                this.status.passwordsCollected++
            } else {
                return
            }
        }
    }
}
