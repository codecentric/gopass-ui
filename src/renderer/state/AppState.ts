import { RouterState } from 'react-router-redux'
import { NotificationState } from '../notifications/notificationReducer'
import { SecretsState } from '../secrets/secretsReducer'

export interface AppState {
    notification: NotificationState
    secrets: SecretsState
    routing: RouterState
}
