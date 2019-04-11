import { PasswordSecret } from '../secrets/AsyncPasswordCollector'
import { PasswordRule, PasswordRuleMeta } from './PasswordRule'
import { allPasswordRules } from './PasswordRules'

export interface PasswordRatingResult {
    totalRulesCount: number
    failedRules: PasswordRuleMeta[]
    health: number
}

const ruleToMeta = (rule: PasswordRule): PasswordRuleMeta => ({ name: rule.name, description: rule.description })
const calculateHealth = (failed: number, total: number) => Math.round(100 - (failed / total) * 100)

export interface PasswordHealthSummary {
    health: number
    ratedPasswordSecrets: PasswordSecret[]
}

export class PasswordRater {
    public static ratePassword(password: string): PasswordRatingResult {
        const totalRulesCount = allPasswordRules.length
        const failedRules = allPasswordRules.filter(rule => !rule.matcher(password)).map(ruleToMeta)

        return {
            totalRulesCount,
            failedRules,
            health: calculateHealth(failedRules.length, totalRulesCount)
        }
    }

    public static rateMultiplePasswords(passwords: PasswordSecret[]): PasswordHealthSummary {
        const pwHealths = passwords.map((passwordSecret: PasswordSecret) => {
            const pwRating = PasswordRater.ratePassword(passwordSecret.value)
            return {
                health: pwRating.health,
                failedRulesCount: pwRating.failedRules.length,
                value: '***',
                name: passwordSecret.name
            }
        }).sort((a, b) => a.health - b.health)
        const pwHealthSum: number = pwHealths.map(h => h.health).reduce((a: number, b: number) => a + b, 0)

        return {
            health: Math.round(pwHealthSum / pwHealths.length),
            ratedPasswordSecrets: pwHealths
        }
    }
}
