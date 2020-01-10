import * as React from 'react'
import * as m from 'react-materialize'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'

import { RouteComponentProps, withRouter } from 'react-router'
import SecretTree from './SecretTree'
import { Tree } from '../../components/tree/TreeComponent'

type SecretExplorerProps = RouteComponentProps & { tree: Tree, onSearchValueChange: (value: string) => void, searchValue: string }

class SecretExplorer extends React.Component<SecretExplorerProps, {}> {
    public render() {
        const { tree, searchValue, onSearchValueChange } = this.props

        return (
            <div className='secret-explorer'>
                <KeyboardEventHandler handleKeys={[ 'esc' ]} handleFocusableElements onKeyEvent={this.clearSearch}/>
                <m.Input className='search-bar' value={searchValue} placeholder='Search...' onChange={(_: any, updatedSearchValue: string) => {
                    onSearchValueChange(updatedSearchValue)
                }}/>
                <SecretTree tree={tree} onSecretClick={this.navigateToSecretDetailView}/>
            </div>
        )
    }

    private navigateToSecretDetailView = (secretName: string) => this.props.history.replace(`/secret/${btoa(secretName)}`)

    private clearSearch = () => this.setState({ searchValue: '' })
}

export default withRouter(SecretExplorer)
