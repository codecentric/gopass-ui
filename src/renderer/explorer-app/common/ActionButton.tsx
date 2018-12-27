import * as React from 'react'
import * as m from 'react-materialize'

export interface ActionButtonProps {
    icon: string
    onClick?: () => void
}

const ActionButton = ({ icon, onClick }: ActionButtonProps) => (
    <m.Button
        floating
        large
        className='red'
        waves='light'
        icon={ icon }
        onClick={ onClick }
        style={ { marginRight: '0.75rem' } }
    />
)

export default ActionButton
