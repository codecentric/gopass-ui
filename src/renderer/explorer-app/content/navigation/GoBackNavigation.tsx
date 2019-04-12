import * as React from 'react'
import { withRouter } from 'react-router'
import { History } from 'history'

import { RoundActionBtn } from '../../../components/RoundActionBtn'

class GoBackNavigation extends React.Component<{ history: History }, any> {
    public render() {
        const onClick = () => this.props.history.replace('/')

        return (
            <div style={ { paddingTop: '0.75rem' } }>
                <RoundActionBtn icon='arrow_back' onClick={ onClick } />
            </div>
        )
    }
}

export default withRouter(GoBackNavigation as any)
