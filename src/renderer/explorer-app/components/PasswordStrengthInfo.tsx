import * as React from 'react'
import * as m from 'react-materialize'

interface PasswordStrengthInfoProps {
    strength: number
    labelContent: any
}

export const PasswordStrengthInfo = ({ strength, labelContent }: PasswordStrengthInfoProps) => (
    <>
        <m.Col s={4}>
            <label className='active'>{labelContent}: {strength + ' %'}</label>
            <m.ProgressBar
                progress={strength}
            />
        </m.Col>
    </>
)
