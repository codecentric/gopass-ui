import * as React from 'react'
import { withRouter } from 'react-router'
import { History } from 'history'

import { RoundActionBtn } from './RoundActionBtn'

const GoBackNavigationBtn = (props: { history: History }) => (
    <div style={{ paddingTop: '0.75rem' }}>
        <RoundActionBtn icon='arrow_back' onClick={() => props.history.replace('/')}/>
    </div>
)

export default withRouter(GoBackNavigationBtn)
