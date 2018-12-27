import * as React from 'react'
import * as m from 'react-materialize'
import { History } from 'history'
import { withRouter } from 'react-router'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'

import SecretTreeViewer from './SecretTreeViewer'

interface SecretExplorerProps {
    searchValue: string
    onSearchChange: (event: any, searchValue: string) => void
    onCancelSearch: (event: any, searchValue: string) => void
    history?: History
}

class SecretExplorer extends React.Component<SecretExplorerProps, {}> {
    render() {
        const { searchValue, onSearchChange, onCancelSearch } = this.props

        return (
            <div className='secret-explorer'>
                <KeyboardEventHandler handleKeys={ [ 'esc' ] } handleFocusableElements onKeyEvent={ onCancelSearch } />
                <m.Input className='search-bar' value={ searchValue } placeholder='Search...' onChange={ onSearchChange } />
                <SecretTreeViewer searchValue={ searchValue } onSecretClick={ this.onSecretClick } />
            </div>
        )
    }

    private onSecretClick = (secretName: string) => {
        this.props.history!.replace(`/${btoa(secretName)}/view`)
    }
}

export default withRouter(SecretExplorer as any) as any
