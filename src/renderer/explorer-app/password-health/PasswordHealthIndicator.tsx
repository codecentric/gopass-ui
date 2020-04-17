import * as React from 'react'

export const passwordStrengthColorExtractor = (health: number): string => {
    if (health >= 70) {
        return 'green'
    }
    if (health >= 50) {
        return 'yellow'
    }

    return 'red'
}

export const PasswordHealthIndicator = ({ health }: { health: number }) => (
    <div className={`password-strength-sum ${passwordStrengthColorExtractor(health)}`}>
        <span>{health}</span>
    </div>
)
