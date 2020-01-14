import * as React from 'react'

import SecretExplorer from './side-navigation/SecretExplorer'
import MainContent from './MainContent'

import './ExplorerApplication.css'
import { Tree } from '../components/tree/TreeComponent'
import Gopass from '../secrets/Gopass'
import SecretsFilterService from './side-navigation/SecretsFilterService'
import SecretsDirectoryService from './side-navigation/SecretsDirectoryService'

interface ExplorerApplicationState {
    tree: Tree
    secretNames: string[]
    searchValue: string
}

export default class ExplorerApplication extends React.Component<{}, ExplorerApplicationState> {
    constructor(props: any) {
        super(props)
        this.state = {
            tree: {
                name: 'Stores',
                toggled: true,
                children: [],
                path: ''
            },
            searchValue: '',
            secretNames: []
        }
    }

    public async componentDidMount() {
        const secretNames = await Gopass.getAllSecretNames()
        this.setState({ secretNames })
        await this.calculateAndSetTreeState(this.state.searchValue)
    }

    public render() {
        const { tree, searchValue } = this.state
        return (
            <>
                <SecretExplorer
                    tree={tree}
                    searchValue={searchValue}
                    onSearchValueChange={async (newValue: string) => {
                        if (newValue !== searchValue) {
                            await this.calculateAndSetTreeState(newValue)
                        }
                        this.setState({ searchValue: newValue })
                    }}/>
                <MainContent onTreeUpdate={() => this.componentDidMount()}/>
            </>
        )
    }

    private async calculateAndSetTreeState(searchValue: string) {
        const { secretNames, tree: previousTree } = this.state

        const filteredSecretNames = SecretsFilterService.filterBySearch(secretNames, searchValue)
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(filteredSecretNames, previousTree)
        this.setState({ ...this.state, tree })
    }
}
