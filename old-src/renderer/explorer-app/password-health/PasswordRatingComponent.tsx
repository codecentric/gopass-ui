import * as React from 'react'
import * as m from 'react-materialize'

import { PasswordRater } from './PasswordRater'
import { PasswordHealthRuleInfo } from './PasswordRule'
import { PasswordHealthIndicator } from './PasswordHealthIndicator'

import './PasswordRatingComponent.css'

export interface PasswordRatingComponentProps {
    secretValue: string
}

export const FailedRulesList = ({ failedRules }: { failedRules: PasswordHealthRuleInfo[] }) => (
    <>
        {failedRules.length > 0 ? (
            <>
                <p>
                    You could improve <strong>{failedRules.length}</strong> characteristica of this password.
                </p>
                <ol className='failed-rules-list'>
                    {failedRules.map((failedRule: PasswordHealthRuleInfo, index: number) => (
                        <li key={index}>
                            <strong>{failedRule.name}:</strong> {failedRule.description}
                        </li>
                    ))}
                </ol>
            </>
        ) : (
            <p>Good job! This secret satisfies all basic criteria for a potentially good password.</p>
        )}
    </>
)

const PasswordRatingComponent = ({ secretValue }: PasswordRatingComponentProps) => {
    const { health, failedRules } = PasswordRater.ratePassword(secretValue)

    return (
        <m.Row>
            <m.Col s={12}>
                <div className='card-panel z-depth-1'>
                    <div className='row valign-wrapper'>
                        <div className='col s2'>
                            <PasswordHealthIndicator health={health} />
                        </div>
                        <div className='col s10'>
                            <FailedRulesList failedRules={failedRules} />
                        </div>
                    </div>
                </div>
            </m.Col>
        </m.Row>
    )
}

export default PasswordRatingComponent
