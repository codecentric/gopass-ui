import * as React from 'react'
import { History } from 'history'

import ActionNavigationWrapper from './ActionNavigationWrapper'
import ActionButton from '../../common/ActionButton'

export default class SmallActionNavigation extends React.Component<{ history: History }, any> {
    render() {
        const onClick = () => this.props.history.replace('/')

        return (
            <ActionNavigationWrapper>
                <ActionButton icon='arrow_back' onClick={onClick} />
            </ActionNavigationWrapper>
        )
    }
}
