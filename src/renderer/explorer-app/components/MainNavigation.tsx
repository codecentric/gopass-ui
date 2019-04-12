import * as React from 'react'
import { History } from 'history'
import { withRouter } from 'react-router'

import Gopass from '../../secrets/Gopass'
import { RoundActionBtn } from '../../components/RoundActionBtn'

interface MainNavigationViewProps {
    history: History
}

const MainNavigationComponent = ({ history }: MainNavigationViewProps) => (
    <div style={ { paddingTop: '0.75rem' } }>
        <RoundActionBtn icon='home' onClick={ () => history.replace('/') } />
        <RoundActionBtn icon='add' onClick={ () => history.replace('/add-secret') } />
        {/*<RoundActionBtn icon='refresh' onClick={ refreshGopassStores } />*/}
        <RoundActionBtn icon='settings' onClick={ () => history.replace('/settings') } />
        <RoundActionBtn icon='security' onClick={ () => history.replace('/password-health') } />
    </div>
)

// TODO
// refreshGopassStores: () => {
//     Gopass.sync()
//         .then(() => {
//             dispatch(showNotification({ status: 'OK', message: 'Your stores have been synchronised successfully.' }))
//         })
//         .catch((err) => {
//             dispatch(showNotification({ status: 'ERROR', message: `Oops, something went wrong: ${JSON.stringify(err)}` }))
//         })
//
// }

export default withRouter(MainNavigationComponent)
