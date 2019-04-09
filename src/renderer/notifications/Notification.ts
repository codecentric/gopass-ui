import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { AppState } from '../state/AppState'
import NotificationView, { NotificationViewProps } from './NotificationView'
import { hideNotification } from './notificationActions'

const mapStateToProps = (state: AppState): NotificationViewProps => ({
    notification: state.notification.notification
})

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    hideNotification: () => {
        dispatch(hideNotification())
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationView)
