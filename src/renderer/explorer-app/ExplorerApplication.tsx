import * as React from 'react'

import SecretExplorer from './side-navigation/SecretExplorer'
import MainContent from './content/MainContent'
import './ExplorerApplication.css'

interface MainApplicationState {
    searchValue: string
}

export default class ExplorerApplication extends React.Component<{}, MainApplicationState> {
    constructor(props: any) {
        super(props)
        this.state = {
            searchValue: ''
        }
    }

    render() {
        const { searchValue } = this.state

        return (
            <div className='wrapper'>
                <SecretExplorer searchValue={ searchValue } onSearchChange={ this.onSearchChange } onCancelSearch={ this.onCancelSearch } />
                <MainContent />
            </div>
        )
    }

    private onSearchChange = (event: any, searchValue: string) => {
        this.setState({ searchValue })
    }

    private onCancelSearch = () => {
        this.setState({ searchValue: '' })
    }
}
