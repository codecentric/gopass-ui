import * as React from 'react'
import { History } from 'history'
import { withRouter } from 'react-router'

import { RoundActionButton } from '../../components/RoundActionButton'
import { useNotificationContext } from '../../common/notifications/NotificationProvider'
import Gopass from '../../secrets/Gopass'
import { useSecretsContext } from '../SecretsProvider'

interface MainNavigationViewProps {
    history: History
}

function MainNavigationComponent({ history }: MainNavigationViewProps) {
    const notificationContext = useNotificationContext()
    const secretsContext = useSecretsContext()

    const refreshGopassStores = async () => {
        try {
            await Gopass.sync()
            await secretsContext.reloadSecretNames()
            notificationContext.show({ status: 'OK', message: 'Your stores have been synchronised successfully.' })
        } catch (err) {
            notificationContext.show({ status: 'ERROR', message: `Oops, something went wrong: ${JSON.stringify(err)}` })
        }
    }

    return (
        <div style={{ paddingTop: '0.75rem' }}>
            <RoundActionButton icon='home' onClick={() => history.replace('/')} />
            <RoundActionButton icon='add' onClick={() => history.replace('/add-secret')} />
            <RoundActionButton icon='refresh' onClick={refreshGopassStores} />
            <RoundActionButton icon='settings' onClick={() => history.replace('/settings')} />
            <RoundActionButton icon='security' onClick={() => history.replace('/password-health')} />
        </div>
    )
}

export default withRouter(MainNavigationComponent)
