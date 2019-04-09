import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import notification from '../notifications/notificationReducer'
import secrets from '../secrets/secretsReducer'
import { AppState } from './AppState'

export const rootReducer = combineReducers<AppState | undefined>({
    notification,
    secrets,
    routing: routerReducer
})
