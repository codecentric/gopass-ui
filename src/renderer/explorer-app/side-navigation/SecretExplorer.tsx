import * as React from 'react'
import { Dispatch } from 'redux'
import * as m from 'react-materialize'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'

import SecretTreeViewer from './SecretTree'
import { AppState } from '../../state/AppState'
import { setSearch, setSearchAndReload } from '../../secrets/secretsActions'

interface SecretExplorerProps {
    searchValue: string
    onSearchChange: (event: any, secretName: string) => void
    onCancelSearch: () => void
}

class SecretExplorer extends React.Component<SecretExplorerProps, {}> {
    public render() {
        const { searchValue, onSearchChange, onCancelSearch } = this.props

        return (
            <div className='secret-explorer'>
                <KeyboardEventHandler handleKeys={ [ 'esc' ] } handleFocusableElements onKeyEvent={ onCancelSearch } />
                <m.Input className='search-bar' value={ searchValue } placeholder='Search...' onChange={ onSearchChange } />
                <SecretTreeViewer />
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    searchValue: state.secrets.searchValue
})

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    onSearchChange: (_: any, newSearchValue: string) => dispatch(setSearchAndReload(newSearchValue) as any),
    onCancelSearch: () => dispatch(setSearchAndReload('') as any)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SecretExplorer) as any) as any
