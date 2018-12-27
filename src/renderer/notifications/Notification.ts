import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { RootState } from '../state/RootState'
import NotificationView, { NotificationViewProps } from './NotificationView'
import { hideNotification } from './notificationActions'

const mapStateToProps = (state: RootState): NotificationViewProps => ({
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
