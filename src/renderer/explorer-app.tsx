import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

import ExplorerApplication from './explorer-app/ExplorerApplication'
import store from './state/store'

import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'

// Create main element
const mainElement = document.createElement('div')
document.body.appendChild(mainElement)

ReactDOM.render(
    <AppContainer>
        <Provider store={store}>
            <Router>
                <ExplorerApplication />
            </Router>
        </Provider>
    </AppContainer>,
    mainElement
)
