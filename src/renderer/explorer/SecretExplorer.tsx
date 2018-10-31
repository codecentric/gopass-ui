import TreeComponent, { Tree } from './TreeComponent'
import * as React from 'react'
import Gopass from '../secrets/Gopass'
import SecretsDirectoryService from '../secrets/SecretsDirectoryService'

export interface SecretExplorerProps {
    onSecretClick: (name: string, value: string) => void
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
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(secretNames)
        this.setState({ tree })
    }

    render() {
        return <TreeComponent tree={this.state.tree} onLeafClick={this.onSecretClick} />
    }

    onSecretClick = async (secretName: string) => {
        this.props.onSecretClick(secretName, await Gopass.show(secretName))
    }
}
