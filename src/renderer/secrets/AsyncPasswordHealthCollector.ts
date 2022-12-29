import Gopass from './Gopass'
import { sortBy } from 'lodash'
import { passwordSecretRegex } from './deriveIconFromSecretName'
import { PasswordRater } from '../explorer-app/password-health/PasswordRater'

export interface PasswordSecretHealth {
    name: string
    health: number
    failedRulesCount: number
}

export interface PasswordHealthCollectionStatus {
    totalPasswords: number
    passwordsCollected: number
    inProgress: boolean
    ratedPasswords: PasswordSecretHealth[]
    error: Error | undefined
}

export default class AsyncPasswordHealthCollector {
    private status: PasswordHealthCollectionStatus = {
        totalPasswords: 0,
        passwordsCollected: 0,
        inProgress: false,
        ratedPasswords: [],
        error: undefined
    }

    public async start() {
        const passwordSecretNames = await this.initializePasswordSecretNames(true)

        try {
            await this.collectPasswordHealthOneAfterAnother(passwordSecretNames)
            this.status.inProgress = false
        } catch (error: any) {
            this.status.error = error
            this.status.inProgress = false
        }
    }

    public async stopAndReset() {
        await this.initializePasswordSecretNames(false)
    }

    public getCurrentStatus(): PasswordHealthCollectionStatus {
        this.status.ratedPasswords = sortBy(this.status.ratedPasswords, (rp: PasswordSecretHealth) => rp.health)
        return this.status
    }

    private async initializePasswordSecretNames(inProgress: boolean): Promise<string[]> {
        this.status.inProgress = inProgress
        const passwordSecretNames = await this.getAllSecretsContainingPasswords()
        this.status.ratedPasswords = []
        this.status.error = undefined
        this.status.totalPasswords = passwordSecretNames.length

        return passwordSecretNames
    }

    private async getAllSecretsContainingPasswords(): Promise<string[]> {
        const allSecretNames = await Gopass.getAllSecretNames()
        return allSecretNames.filter(secretName => passwordSecretRegex.test(secretName))
    }

    private collectPasswordHealthOneAfterAnother = async (passwordSecretNames: string[]) => {
        this.status.ratedPasswords = []

        // use for-loop to do only one Gopass lookup at a time
        for (const name of passwordSecretNames) {
            if (this.status.inProgress) {
                const value = await Gopass.show(name)
                const { health, failedRules } = PasswordRater.ratePassword(value)

                this.status.ratedPasswords.push({ name, health, failedRulesCount: failedRules.length })
                this.status.passwordsCollected++
            } else {
                return
            }
        }
    }
}
