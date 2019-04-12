import * as React from 'react'
import { History } from 'history'
import { withRouter } from 'react-router'

import { RoundActionBtn } from '../../../components/RoundActionBtn'

interface MainNavigationViewProps {
    history?: History
    refreshGopassStores: () => void
}

class MainNavigationView extends React.Component<MainNavigationViewProps> {
    public render() {
        const { history } = this.props

        return (
            <div style={ { paddingTop: '0.75rem' } }>
                <RoundActionBtn icon='home' onClick={ () => history!.replace('/') } />
                <RoundActionBtn icon='add' onClick={ () => history!.replace('/add-secret') } />
                <RoundActionBtn icon='refresh' onClick={ this.props.refreshGopassStores } />
                <RoundActionBtn icon='settings' onClick={ () => history!.replace('/settings') } />
                <RoundActionBtn icon='security' onClick={ () => history!.replace('/password-health') } />
            </div>
        )
    }
}

export default withRouter(MainNavigationView as any) as any
