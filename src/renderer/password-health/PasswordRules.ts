import { PasswordSecret } from '../secrets/AsyncPasswordCollector'

export interface PasswordRuleMeta {
    name: string
    description: string
}

export interface PasswordRule extends PasswordRuleMeta {
    matcher: (password: string) => boolean
}

const minimumLengthRule: PasswordRule = {
    matcher: (password: string) => password.length >= 10,
    name: 'Minimal length of 10 characters',
    description: 'Good passwords should have a minimum of 10 characters'
}

const lowerCaseRule: PasswordRule = {
    matcher: (password: string) => /(?=.*[a-z])/.test(password),
    name: 'Lowercase letters',
    description: 'Make sure to have a least one lowercase letter inside'
}

const upperCaseRule: PasswordRule = {
    matcher: (password: string) => /(?=.*[A-Z])/.test(password),
    name: 'Uppercase letters',
    description: 'Make sure to have a least one uppercase letter inside'
}

const specialCharRule: PasswordRule = {
    matcher: (password: string) => /(?=.*\W)/.test(password),
    name: 'Special characters',
    description: 'Use special characters to make your password stronger'
}

const numbersRule: PasswordRule = {
    matcher: (password: string) => /(?=.*\d)/.test(password),
    name: 'Numbers',
    description: 'Make sure to use at least one number to improve your password'
}

const noRepetitiveCharactersRule: PasswordRule = {
    matcher: (password: string) => !/(.)\1{2,}/.test(password),
    name: 'No repetitive characters',
    description: 'Passwords are better if characters are not repeated often (sequence of three or more).'
}

const allRules: PasswordRule[] = [ minimumLengthRule, lowerCaseRule, upperCaseRule, specialCharRule, numbersRule, noRepetitiveCharactersRule ]

export interface PasswordRatingResult {
    totalRulesCount: number
    failedRules: PasswordRuleMeta[]
    health: number
}

const ruleToMeta = (rule: PasswordRule): PasswordRuleMeta => ({ name: rule.name, description: rule.description })
export const ratePassword = (password: string): PasswordRatingResult => {
    const totalRulesCount = allRules.length
    const failedRules = allRules.filter(rule => !rule.matcher(password)).map(ruleToMeta)

    return {
        totalRulesCount,
        failedRules,
        health: Math.round(100 - (failedRules.length / totalRulesCount) * 100)
    }
}

export interface PasswordHealthSummary {
    health: number
    ratedPasswordSecrets: PasswordSecret[]
}

export const rateMultiplePasswords = (passwords: PasswordSecret[]): PasswordHealthSummary => {
    const pwHealths = passwords.map((passwordSecret: PasswordSecret) => {
        const pwRating = ratePassword(passwordSecret.value)
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
