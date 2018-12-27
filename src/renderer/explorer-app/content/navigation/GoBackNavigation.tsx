import * as React from 'react'
import { History } from 'history'

import ActionButton from '../../common/ActionButton'

export default class GoBackNavigation extends React.Component<{ history: History }, any> {
    render() {
        const onClick = () => this.props.history.replace('/')

        return (
            <div style={ { paddingTop: '0.75rem' } }>
                <ActionButton icon='arrow_back' onClick={ onClick } />
            </div>
        )
    }
}
