import * as React from 'react'

import SecretExplorer from './side-navigation/SecretExplorer'
import MainContent from './content/MainContent'
import './ExplorerApplication.css'

export default class ExplorerApplication extends React.Component<{}, {}> {
    public render() {
        return (
            <div className='wrapper'>
                <SecretExplorer />
                <MainContent />
            </div>
        )
    }
}
