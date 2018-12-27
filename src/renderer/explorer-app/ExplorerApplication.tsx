import * as React from 'react'
import { History } from 'history'

import SecretExplorer from './side-navigation/SecretExplorer'
import MainContent from './content/MainContent'
import './ExplorerApplication.css'

interface MainApplicationState {
    searchValue: string
}
interface MainApplicationProps {
    history: History
}

export default class ExplorerApplication extends React.Component<MainApplicationProps, MainApplicationState> {
    constructor(props: any) {
        super(props)
        this.state = {
            searchValue: ''
        }
    }

    render() {
        const { searchValue } = this.state
        const { history } = this.props

        return (
            <div className='wrapper'>
                <SecretExplorer history={history} searchValue={searchValue} onSearchChange={this.onSearchChange} onCancelSearch={this.onCancelSearch} />
                <MainContent history={history} />
            </div>
        )
    }

    private onSearchChange = (event: any, searchValue: string) => {
        this.setState({ ...this.state, searchValue })
    }

    private onCancelSearch = (event: any, searchValue: string) => {
        this.onSearchChange(event, '')
    }

    private onSecretClick = (secretName: string) => {
        this.props.history.replace(`/${btoa(secretName)}/view`)
    }
}
