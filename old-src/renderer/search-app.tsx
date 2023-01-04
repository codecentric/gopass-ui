import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { AppContainer } from 'react-hot-loader'

import { SearchApplication } from './search-app/SearchApplication'

import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'

const mainElement = document.createElement('div')
document.body.appendChild(mainElement)

const root = createRoot(mainElement)
root.render(
    <AppContainer>
        <SearchApplication />
    </AppContainer>
)
