import TreeComponent, { Tree } from './TreeComponent'
import * as React from 'react'
import Gopass from '../../secrets/Gopass'
import SecretsDirectoryService from '../../secrets/SecretsDirectoryService'
import SecretsFilterService from '../../secrets/SecretsFilterService'

export interface SecretTreeViewerProps {
    onSecretClick: (name: string, value: string) => void
    searchValue: string
}

interface SecretTreeViewerState {
    tree: Tree
}

export default class SecretTreeViewer extends React.Component<SecretTreeViewerProps, SecretTreeViewerState> {
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

    public async componentDidMount() {
        const secretNames = await Gopass.getAllSecretNames()
        const filteredSecretNames = SecretsFilterService.filterBySearch(secretNames, this.props.searchValue)
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(filteredSecretNames)
        this.setState({ ...this.state, tree })
    }

    public async componentWillReceiveProps(props: SecretTreeViewerProps) {
        if (props.searchValue !== this.props.searchValue) {
            await this.componentDidMount()
        }
    }

    public render() {
        return <TreeComponent tree={this.state.tree} onLeafClick={this.onSecretClick} />
    }

    private onSecretClick = async (secretName: string) => {
        this.props.onSecretClick(secretName, await Gopass.show(secretName))
    }
}
