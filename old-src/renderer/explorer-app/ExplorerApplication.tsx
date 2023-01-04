import * as React from 'react'

import { SecretExplorer } from './side-navigation/SecretExplorer'
import MainContent from './MainContent'

import './ExplorerApplication.css'

const ExplorerApplication = () => {
    return (
        <>
            <SecretExplorer />
            <MainContent />
        </>
    )
}

export default ExplorerApplication
