import { PasswordHealthRule, PasswordHealthRuleInfo } from './PasswordRule'
import { allPasswordHealthRules } from './PasswordHealthRules'
import { PasswordSecretHealth } from '../../secrets/AsyncPasswordHealthCollector'

export interface PasswordRatingResult {
    totalRulesCount: number
    failedRules: PasswordHealthRuleInfo[]
    health: number
}

const ruleToMeta = (rule: PasswordHealthRule): PasswordHealthRuleInfo => ({ name: rule.name, description: rule.description })
const calculateHealth = (failed: number, total: number) => Math.round(100 - (failed / total) * 100)

export interface PasswordHealthSummary {
    health: number
    ratedPasswordSecrets: PasswordSecretHealth[]
}

export class PasswordRater {
    public static ratePassword(password: string): PasswordRatingResult {
        const totalRulesCount = allPasswordHealthRules.length
        const failedRules = allPasswordHealthRules.filter(rule => !rule.matcher(password)).map(ruleToMeta)

        return {
            totalRulesCount,
            failedRules,
            health: calculateHealth(failedRules.length, totalRulesCount)
        }
    }

    public static buildOverallPasswordHealthSummary(passwordHealths: PasswordSecretHealth[]): PasswordHealthSummary {
        const pwHealthSum = passwordHealths.map(h => h.health).reduce((a: number, b: number) => a + b, 0)

        return {
            health: Math.round(pwHealthSum / passwordHealths.length),
            ratedPasswordSecrets: passwordHealths
        }
    }
}
