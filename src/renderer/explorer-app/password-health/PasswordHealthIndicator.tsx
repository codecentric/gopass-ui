import * as React from 'react'

const passwordStrengthColorExtractor = (health: number): string => {
    if (health >= 50) {
        return 'yellow'
    }
    if (health >= 70) {
        return 'green'
    }

    return 'red'
}

export const PasswordHealthIndicator = ({ health }: { health: number }) => (
    <div className={`password-strength-sum ${passwordStrengthColorExtractor(health)}`}>
        <span>{health}</span>
    </div>
)
