import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

import Application from './main-app/Application'
import store from './state/store'

import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'

// Create main element
const mainElement = document.createElement('div')
document.body.appendChild(mainElement)

ReactDOM.render(
    <AppContainer>
        <Provider store={store}>
            <Application />
        </Provider>
    </AppContainer>,
    mainElement
)
