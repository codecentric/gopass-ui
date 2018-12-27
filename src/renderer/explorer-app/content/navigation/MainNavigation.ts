import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { showNotification } from '../../../notifications/notificationActions'
import Gopass from '../../../secrets/Gopass'
import MainNavigationView from './MainNavigationView'

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    refreshGopassStores: () => {
        Gopass.sync()
            .then(() => {
                dispatch(showNotification({ status: 'OK', message: 'Your stores have been synchronised successfully.' }))
            })
            .catch((err) => {
                dispatch(showNotification({ status: 'ERROR', message: `Oops, something went wrong: ${JSON.stringify(err)}` }))
            })

    }
})

export default connect(
    undefined,
    mapDispatchToProps
)(MainNavigationView)
