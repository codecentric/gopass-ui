import * as React from 'react'
import * as m from 'react-materialize'
import { withRouter, RouteComponentProps } from 'react-router'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'
import SecretTree from './SecretTree'

class SecretExplorer extends React.Component<RouteComponentProps, { searchValue: string }> {
    constructor(props: RouteComponentProps) {
        super(props)
        this.state = { searchValue: '' }
    }

    public render() {
        const { searchValue } = this.state

        return (
            <div className='secret-explorer'>
                <KeyboardEventHandler handleKeys={ [ 'esc' ] } handleFocusableElements onKeyEvent={ this.onCancelSearch } />
                <m.Input className='search-bar' value={ searchValue } placeholder='Search...' onChange={ this.onSearchChange } />
                <SecretTree searchValue={ searchValue } onSecretClick={ this.onSecretClick } />
            </div>
        )
    }

    private onSecretClick = (secretName: string) => {
        this.props.history.replace(`/secret/${btoa(secretName)}`)
    }

    private onSearchChange = (_: any, searchValue: string) => this.setState({ searchValue })

    private onCancelSearch = () => this.setState({ searchValue: '' })
}

export default withRouter(SecretExplorer)
