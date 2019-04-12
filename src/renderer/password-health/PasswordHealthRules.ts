import { PasswordHealthRule } from './PasswordRule'

const minimumLengthRule: PasswordHealthRule = {
    matcher: (password: string) => password.length >= 10,
    name: 'Minimal length of 10 characters',
    description: 'Good passwords should have a minimum of 10 characters'
}

const lowerCaseRule: PasswordHealthRule = {
    matcher: (password: string) => /(?=.*[a-z])/.test(password),
    name: 'Lowercase letters',
    description: 'Make sure to have a least one lowercase letter inside'
}

const upperCaseRule: PasswordHealthRule = {
    matcher: (password: string) => /(?=.*[A-Z])/.test(password),
    name: 'Uppercase letters',
    description: 'Make sure to have a least one uppercase letter inside'
}

const specialCharRule: PasswordHealthRule = {
    matcher: (password: string) => /(?=.*\W)/.test(password),
    name: 'Special characters',
    description: 'Use special characters to make your password stronger'
}

const numbersRule: PasswordHealthRule = {
    matcher: (password: string) => /(?=.*\d)/.test(password),
    name: 'Numbers',
    description: 'Make sure to use at least one number to improve your password'
}

const noRepetitiveCharactersRule: PasswordHealthRule = {
    matcher: (password: string) => !/(.)\1{2,}/.test(password),
    name: 'No repetitive characters',
    description: 'Passwords are better if characters are not repeated often (sequence of three or more).'
}

export const allPasswordHealthRules: PasswordHealthRule[] = [
    minimumLengthRule,
    lowerCaseRule,
    upperCaseRule,
    specialCharRule,
    numbersRule,
    noRepetitiveCharactersRule
]
