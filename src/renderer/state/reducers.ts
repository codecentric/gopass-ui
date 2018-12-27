import { combineReducers } from 'redux'
import notification from '../notifications/notificationReducer'
import { RootState } from './RootState'

export const rootReducer = combineReducers<RootState | undefined>({
    notification
})
