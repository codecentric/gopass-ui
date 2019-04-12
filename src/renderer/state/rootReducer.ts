import { combineReducers } from 'redux'
import notification from '../notifications/notificationReducer'
import { AppState } from './AppState'

export const rootReducer = combineReducers<AppState | undefined>({
    notification
})
