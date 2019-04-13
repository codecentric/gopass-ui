import * as React from 'react'
import * as m from 'react-materialize'

export interface RoundActionBtnProps {
    icon: string
    onClick?: () => void
}

export const RoundActionBtn = ({ icon, onClick }: RoundActionBtnProps) => (
    <m.Button
        floating
        large
        className='red'
        waves='light'
        icon={icon}
        onClick={onClick}
        style={{ marginRight: '0.75rem' }}
    />
)
