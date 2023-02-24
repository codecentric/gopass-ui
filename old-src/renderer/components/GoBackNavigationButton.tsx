import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { RoundActionButton } from './RoundActionButton'

const GoBackNavigationButton = () => {
    const navigate = useNavigate()

    return (
        <div style={{ paddingTop: '0.75rem' }}>
            <RoundActionButton icon='arrow_back' onClick={() => navigate('/')} />
        </div>
    )
}

export default GoBackNavigationButton
