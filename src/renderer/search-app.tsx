import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { SearchApplication } from './search-app/SearchApplication'

import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'

const mainElement = document.createElement('div')
document.body.appendChild(mainElement)

ReactDOM.render(
    <SearchApplication />,
    mainElement
)
