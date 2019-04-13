import * as React from 'react'

const passwordStrengthColorExtractor = (health: number): string => {
    let colorStrengthIndicator = 'red'
    if (health >= 50) {
        colorStrengthIndicator = 'yellow'
    }
    if (health >= 70) {
        colorStrengthIndicator = 'green'
    }
    return colorStrengthIndicator
}

export const PasswordHealthIndicator = ({ health }: { health: number }) => (
    <div className={`password-strength-sum ${passwordStrengthColorExtractor(health)}`}>
        <span>{health}</span>
    </div>
)
