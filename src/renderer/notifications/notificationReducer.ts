import { HIDE_NOTIFICATION, HideNotification, SHOW_NOTIFICATION, ShowNotification } from './notificationActions'

export const INITIAL_STATE: NotificationState = {
    notification: undefined
}

export interface Notification {
    status: 'OK' | 'ERROR'
    message: string
}

export interface NotificationState {
    notification?: Notification
}

export type Actions = ShowNotification | HideNotification

const notificationReducer = (state: NotificationState = INITIAL_STATE, action: Actions): NotificationState => {
    switch (action.type) {
        case SHOW_NOTIFICATION:
            return {
                notification: action.payload
            }
        case HIDE_NOTIFICATION:
            return {
                notification: undefined
            }

        default:
            return state
    }
}

export default notificationReducer
