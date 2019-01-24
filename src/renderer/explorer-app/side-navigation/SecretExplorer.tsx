import * as React from 'react'
import * as m from 'react-materialize'
import { History } from 'history'
import { withRouter } from 'react-router'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'
import SecretTreeViewer from './SecretTreeViewer'

interface SecretExplorerProps {
    history?: History
}

class SecretExplorer extends React.Component<SecretExplorerProps, { searchValue: string }> {
    constructor(props: SecretExplorerProps) {
        super(props)
        this.state = { searchValue: '' }
    }

    render() {
        const { searchValue } = this.state

        return (
            <div className='secret-explorer'>
                <KeyboardEventHandler handleKeys={ [ 'esc' ] } handleFocusableElements onKeyEvent={ this.onCancelSearch } />
                <m.Input className='search-bar' value={ searchValue } placeholder='Search...' onChange={ this.onSearchChange } />
                <SecretTreeViewer searchValue={ searchValue } onSecretClick={ this.onSecretClick } />
            </div>
        )
    }

    private onSecretClick = (secretName: string) => {
        this.props.history!.replace(`/secrets/${btoa(secretName)}/view`)
    }

    private onSearchChange = (event: any, searchValue: string) => {
        this.setState({ searchValue })
    }

    private onCancelSearch = () => {
        this.setState({ searchValue: '' })
    }
}

export default withRouter(SecretExplorer as any) as any
