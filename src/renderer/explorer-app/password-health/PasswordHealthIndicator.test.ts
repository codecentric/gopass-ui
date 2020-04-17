import { passwordStrengthColorExtractor } from './PasswordHealthIndicator'

describe('PasswordHealthIndicator', () => {
    it.each`
        health | color
        ${70}  | ${'green'}
        ${100} | ${'green'}
        ${90}  | ${'green'}
        ${80}  | ${'green'}
        ${60}  | ${'yellow'}
        ${50}  | ${'yellow'}
        ${40}  | ${'red'}
        ${5}   | ${'red'}
        ${20}  | ${'red'}
        ${5}   | ${'red'}
    `('should result in color "$color" with health $health', ({ health, color }) => {
        expect(passwordStrengthColorExtractor(health)).toBe(color)
    })
})
