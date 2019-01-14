import * as React from 'react'
import { PasswordRatingResult, PasswordRuleMeta } from './PasswordRules'
import './PasswordRatingComponent.css'

export interface PasswordRatingComponentProps {
    passwordRating: PasswordRatingResult
}

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

export const FailedRulesList = ({ failedRules }: { failedRules: PasswordRuleMeta[] }) => (
    <>
        {
            failedRules.length > 0 ? (
                <>
                    <p>You could improve <strong>{failedRules.length}</strong> characteristica of this password.</p>
                    <ol className='failed-rules-list'>
                        {
                            failedRules.map((failedRule: PasswordRuleMeta, index: number)  => (
                                <li key={ index }>
                                    <strong>{failedRule.name}:</strong> {failedRule.description}
                                </li>
                            ))
                        }
                    </ol>
                </>
            ) :
            <p>Good job! This secret satisfies all basic criteria for a potentially good password.</p>
        }
    </>
)

export const PasswordHealthIndicator = ({ health }: { health: number }) => (
    <div className={ `password-strength-sum ${passwordStrengthColorExtractor(health)}` }>
        <span>{ health }</span>
    </div>
)

export default class PasswordRatingComponent extends React.Component<PasswordRatingComponentProps, any> {
    public render() {
        const { health, failedRules } = this.props.passwordRating

        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card-panel z-depth-1'>
                        <div className='row valign-wrapper'>
                            <div className='col s2'>
                                <PasswordHealthIndicator health={ health } />
                            </div>
                            <div className='col s10'>
                                <FailedRulesList failedRules={ failedRules }/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
