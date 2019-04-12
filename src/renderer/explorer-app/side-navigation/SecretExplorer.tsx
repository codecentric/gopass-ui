import * as React from 'react'
import * as m from 'react-materialize'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'

import SecretTree from './SecretTree'
import SecretsFilterService from '../../secrets/SecretsFilterService'
import { Tree } from '../../components/tree/TreeComponent'
import SecretsDirectoryService from '../../secrets/SecretsDirectoryService'
import Gopass from '../../secrets/Gopass'

interface SecretExplorerState {
    tree: Tree
    searchValue: string
    secretNames: string[]
}

export default class SecretExplorer extends React.Component<{}, SecretExplorerState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            tree: {
                name: 'Stores',
                toggled: true,
                children: []
            },
            secretNames: [],
            searchValue: ''
        }
    }

    public async createTreeState() {
        const { searchValue, secretNames } = this.state
        const filteredSecretNames = SecretsFilterService.filterBySearch(secretNames, searchValue)
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(filteredSecretNames)
        this.setState({ tree })
    }

    public async componentDidMount() {
        const secretNames = await Gopass.getAllSecretNames()
        this.setState({ secretNames })
        await this.createTreeState()
    }

    public async componentWillUpdate(_: any, nextState: SecretExplorerState) {
        if (nextState.searchValue !== this.state.searchValue) {
            await this.createTreeState()
        }
    }

    public render() {
        const { searchValue } = this.state

        return (
            <div className='secret-explorer'>
                <KeyboardEventHandler handleKeys={ [ 'esc' ] } handleFocusableElements onKeyEvent={ this.onCancelSearch } />
                <m.Input className='search-bar' value={ searchValue } placeholder='Search...' onChange={ this.onSearchChange } />
                <SecretTree tree={ this.state.tree } />
            </div>
        )
    }

    private onCancelSearch = () => this.setState({ searchValue: '' })
    private onSearchChange = (_: any, searchValue: string) => this.setState({ searchValue })
}
