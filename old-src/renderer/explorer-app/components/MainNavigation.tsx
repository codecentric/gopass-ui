import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { RoundActionButton } from '../../components/RoundActionButton'
import { useNotificationContext } from '../../common/notifications/NotificationProvider'
import Gopass from '../../secrets/Gopass'
import { useSecretsContext } from '../SecretsProvider'

export default function MainNavigationComponent() {
    const notificationContext = useNotificationContext()
    const secretsContext = useSecretsContext()
    const navigate = useNavigate()

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
            <RoundActionButton icon='home' onClick={() => navigate('/')} />
            <RoundActionButton icon='add' onClick={() => navigate('/add-secret')} />
            <RoundActionButton icon='refresh' onClick={refreshGopassStores} />
            <RoundActionButton icon='settings' onClick={() => navigate('/settings')} />
            <RoundActionButton icon='storage' onClick={() => navigate('/mounts')} />
            <RoundActionButton icon='security' onClick={() => navigate('/password-health')} />
        </div>
    )
}
