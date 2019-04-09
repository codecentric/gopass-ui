import { applyMiddleware, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'

import { rootReducer } from './rootReducer'
import { AppState } from './AppState'

const history = createHistory()

const configureStore = (initialState?: AppState): Store<AppState | undefined> => {
    const middlewares: any[] = [ thunk, routerMiddleware(history as any) ]
    const enhancer = composeWithDevTools(applyMiddleware(...middlewares))
    return createStore(rootReducer, initialState, enhancer)
}

const store = configureStore()
syncHistoryWithStore(history as any, store)
export default store
