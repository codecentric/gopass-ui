import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

import MainApplication from './main-app/MainApplication'
import store from './state/store'

import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'

// Create main element
const mainElement = document.createElement('div')
document.body.appendChild(mainElement)

ReactDOM.render(
    <AppContainer>
        <Provider store={store}>
            <MainApplication />
        </Provider>
    </AppContainer>,
    mainElement
)
