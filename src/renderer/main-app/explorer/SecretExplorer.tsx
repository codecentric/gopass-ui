import TreeComponent, { Tree } from './TreeComponent'
import * as React from 'react'
import Gopass from '../../secrets/Gopass'
import SecretsDirectoryService from '../../secrets/SecretsDirectoryService'
import SecretsFilterService from '../../secrets/SecretsFilterService'

export interface SecretExplorerProps {
    onSecretClick: (name: string, value: string) => void
    searchValue: string
}

interface SecretExplorerState {
    tree: Tree
}

export default class SecretExplorer extends React.Component<
    SecretExplorerProps,
    SecretExplorerState
    > {
    constructor(props: any) {
        super(props)
        this.state = {
            tree: {
                name: 'Stores',
                toggled: true,
                children: []
            }
        }
    }

    async componentDidMount() {
        const secretNames = await Gopass.getAllSecretNames()
        const filteredSecretNames = SecretsFilterService.filterBySearch(secretNames, this.props.searchValue)
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(filteredSecretNames)
        this.setState({ ...this.state, tree })
    }

    async componentWillReceiveProps(props: SecretExplorerProps) {
        if (props.searchValue !== this.props.searchValue) {
            await this.componentDidMount()
        }
    }

    render() {
        return <TreeComponent tree={this.state.tree} onLeafClick={this.onSecretClick} />
    }

    onSecretClick = async (secretName: string) => {
        this.props.onSecretClick(secretName, await Gopass.show(secretName))
    }
}
