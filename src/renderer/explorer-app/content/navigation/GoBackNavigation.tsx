import * as React from 'react'
import { withRouter } from 'react-router'
import { History } from 'history'

import ActionButton from '../../common/ActionButton'

class GoBackNavigation extends React.Component<{ history: History }, any> {
    render() {
        const onClick = () => this.props.history.replace('/')

        return (
            <div style={ { paddingTop: '0.75rem' } }>
                <ActionButton icon='arrow_back' onClick={ onClick } />
            </div>
        )
    }
}

export default withRouter(GoBackNavigation as any)
