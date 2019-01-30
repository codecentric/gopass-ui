import * as React from 'react'
import { History } from 'history'
import { withRouter } from 'react-router'

import ActionButton from '../../common/ActionButton'

interface MainNavigationViewProps {
    history?: History
    refreshGopassStores: () => void
}

class MainNavigationView extends React.Component<MainNavigationViewProps> {
    public render() {
        const { history } = this.props

        return (
            <div style={ { paddingTop: '0.75rem' } }>
                <ActionButton icon='home' onClick={ () => history!.replace('/') } />
                <ActionButton icon='add' onClick={ () => history!.replace('/add-secret') } />
                <ActionButton icon='refresh' onClick={ this.props.refreshGopassStores } />
                <ActionButton icon='settings' onClick={ () => history!.replace('/settings') } />
                <ActionButton icon='security' onClick={ () => history!.replace('/password-health') } />
            </div>
        )
    }
}

export default withRouter(MainNavigationView as any) as any
