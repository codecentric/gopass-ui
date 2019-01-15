import Gopass from './Gopass'
import { passwordSecretRegex } from '../explorer-app/side-navigation/SecretIcons'

export interface PasswordSecret {
    name: string
    value: string
    health?: number
    failedRulesCount?: number
}

export interface CollectionStats {
    totalPasswords: number
    passwordsCollected: number
    inProgress: boolean
    passwords: PasswordSecret[]
    error: Error | undefined
}

export default class AsyncPasswordCollector {
    private totalPasswords: number = 0
    private passwordsCollected: number = 0
    private inProgress: boolean = false
    private passwords: PasswordSecret[] = []
    private error: Error | undefined = undefined

    public async start() {
        const passwordSecretNames = (await Gopass.getAllSecretNames()).filter(secretName => passwordSecretRegex.test(secretName))

        this.inProgress = true
        this.passwords = []
        this.error = undefined
        this.totalPasswords = passwordSecretNames.length

        try {
            await this.collectPasswordsAfterAnother(passwordSecretNames)
            this.inProgress = false
        } catch (e) {
            this.error = e
            this.inProgress = false
        }
    }

    public async stopAndReset() {
        const passwordSecretNames = (await Gopass.getAllSecretNames()).filter(secretName => passwordSecretRegex.test(secretName))

        this.inProgress = false
        this.passwords = []
        this.error = undefined
        this.totalPasswords = passwordSecretNames.length
    }

    public getCurrentStats(): CollectionStats {
        return {
            totalPasswords: this.totalPasswords,
            passwordsCollected: this.passwordsCollected,
            inProgress: this.inProgress,
            passwords: this.passwords,
            error: this.error
        }
    }

    private collectPasswordsAfterAnother = async (passwordSecretNames: string[]) => {
        this.passwords = []

        for (let name of passwordSecretNames) {
            if (this.inProgress) {
                const value = await Gopass.show(name)
                
                this.passwords.push({ name, value })
                this.passwordsCollected++
            } else {
                return
            }
        }
    }
}