import * as React from 'react'
import { withRouter } from 'react-router'
import { History } from 'history'

import { RoundActionButton } from './RoundActionButton'

const GoBackNavigationButton = (props: { history: History }) => (
    <div style={{ paddingTop: '0.75rem' }}>
        <RoundActionButton icon='arrow_back' onClick={() => props.history.replace('/')} />
    </div>
)

export default withRouter(GoBackNavigationButton)
