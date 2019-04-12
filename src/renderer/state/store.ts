import { applyMiddleware, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { rootReducer } from './rootReducer'
import { AppState } from './AppState'

const configureStore = (initialState?: AppState): Store<AppState | undefined> => {
    const middlewares: any[] = []
    const enhancer = composeWithDevTools(applyMiddleware(...middlewares))
    return createStore(rootReducer, initialState, enhancer)
}

const store = configureStore()
export default store
