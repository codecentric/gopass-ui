import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'

import ExplorerApplication from './explorer-app/ExplorerApplication'

import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'
import 'animate.css/animate.css'
import { SecretsProvider } from './explorer-app/SecretsProvider'

const mainElement = document.createElement('div')
document.body.appendChild(mainElement)

ReactDOM.render(
    <Router>
        <SecretsProvider>
            <ExplorerApplication />
        </SecretsProvider>
    </Router>,
    mainElement
)
