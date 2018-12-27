import * as React from 'react'
import * as m from 'react-materialize'

export interface ActionButtonProps {
    icon: string
    onClick?: () => void
    style?: any
}

const ActionButton = ({ icon, onClick, style }: ActionButtonProps) => (
    <m.Button
        floating
        large
        className='red'
        waves='light'
        icon={icon}
        onClick={onClick}
        style={style}
    />
)

export default ActionButton
