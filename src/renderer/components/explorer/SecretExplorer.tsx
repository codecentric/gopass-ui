import TreeComponent, { Tree } from './TreeComponent'
import * as React from 'react'
import Gopass from '../../service/Gopass'
import SecretsDirectoryService from '../../service/SecretsDirectoryService'

const testLeafClick = async (secretName: string) => console.log(await Gopass.show(secretName))
interface SecretExplorerState {
    tree: Tree
}

export default class SecretExplorer extends React.Component<any, SecretExplorerState> {
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
        console.log(this.state)
    }

    render() {
        return <TreeComponent tree={this.state.tree} onLeafClick={testLeafClick} />
    }
}
