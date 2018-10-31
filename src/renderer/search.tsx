import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

import Application from './search/Application'
import store from './store'

import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'

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
