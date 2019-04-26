import * as React from 'react'

import Gopass from '../../secrets/Gopass'
import TreeComponent, { Tree } from '../../components/tree/TreeComponent'
import SecretsFilterService from './SecretsFilterService'
import SecretsDirectoryService from './SecretsDirectoryService'

export interface SecretTreeViewerProps {
    onSecretClick: (name: string) => void
    searchValue: string
}

export default class SecretTreeViewer extends React.Component<SecretTreeViewerProps, { tree: Tree, secretNames: string[] }> {
    constructor(props: any) {
        super(props)
        this.state = {
            tree: {
                name: 'Stores',
                toggled: true,
                children: []
            },
            secretNames: []
        }
    }

    public async componentDidMount() {
        const secretNames = await Gopass.getAllSecretNames()
        this.setState({ secretNames })
        await this.calculateAndSetTreeState(this.props.searchValue)
    }

    public async componentWillReceiveProps(newProps: SecretTreeViewerProps) {

        if (newProps.searchValue !== this.props.searchValue) {
            await this.calculateAndSetTreeState(newProps.searchValue)
        }
    }

    public render() {
        return (
            <TreeComponent
                tree={this.state.tree}
                onLeafClick={this.props.onSecretClick}
            />
        )
    }

    private async calculateAndSetTreeState(searchValue: string) {
        const filteredSecretNames = SecretsFilterService.filterBySearch(this.state.secretNames, searchValue)
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(filteredSecretNames)
        this.setState({ ...this.state, tree })
    }
}
