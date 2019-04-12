import * as React from 'react'
import { History } from 'history'
import { withRouter } from 'react-router'

import { RoundActionBtn } from '../../components/RoundActionBtn'
import { useNotificationContext } from '../../notifications/NotificationProvider'
import Gopass from '../../secrets/Gopass'

interface MainNavigationViewProps {
    history: History
}

function MainNavigationComponent({ history }: MainNavigationViewProps) {
    const notificationContext = useNotificationContext()
    const refreshGopassStores = () => {
        Gopass.sync().then(() => {
            notificationContext.show({ status: 'OK', message: 'Your stores have been synchronised successfully.' })
        })
        .catch((err) => {
            notificationContext.show({ status: 'ERROR', message: `Oops, something went wrong: ${JSON.stringify(err)}` })
        })
    }

    return <div style={ { paddingTop: '0.75rem' } }>
        <RoundActionBtn icon='home' onClick={ () => history.replace('/') } />
        <RoundActionBtn icon='add' onClick={ () => history.replace('/add-secret') } />
        <RoundActionBtn icon='refresh' onClick={ refreshGopassStores } />
        <RoundActionBtn icon='settings' onClick={ () => history.replace('/settings') } />
        <RoundActionBtn icon='security' onClick={ () => history.replace('/password-health') } />
    </div>
}

export default withRouter(MainNavigationComponent)
