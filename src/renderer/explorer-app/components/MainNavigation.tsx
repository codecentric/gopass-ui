import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { RoundActionButton } from '../../components/RoundActionButton'
import { useNotificationContext } from '../../common/notifications/NotificationProvider'
import Gopass from '../../secrets/Gopass'
import { useSecretsContext } from '../SecretsProvider'

function MainNavigation() {
    const navigate = useNavigate()
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
            <RoundActionButton icon='home' onClick={() => navigate('/', { replace: true })} />
            <RoundActionButton icon='add' onClick={() => navigate('/add-secret', { replace: true })} />
            <RoundActionButton icon='refresh' onClick={refreshGopassStores} />
            <RoundActionButton icon='settings' onClick={() => navigate('/settings', { replace: true })} />
            <RoundActionButton icon='storage' onClick={() => navigate('/mounts', { replace: true })} />
            <RoundActionButton icon='security' onClick={() => navigate('/password-health', { replace: true })} />
        </div>
    )
}

export default MainNavigation
