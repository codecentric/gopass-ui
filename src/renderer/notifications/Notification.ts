import { connect } from 'react-redux'
import { RootState } from '../state/RootState'
import NotificationView, { NotificationViewProps } from './NotificationView'
import { Dispatch } from "redux"
import Gopass from "../secrets/Gopass"
import { hideNotification, showNotification } from "./notificationActions"

const mapStateToProps = (state: RootState): NotificationViewProps => ({
    notification: state.notification.notification
})

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    hideNotification: () => {
        console.log('HIDE NOTIFICATION')
        dispatch(hideNotification())
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationView)
