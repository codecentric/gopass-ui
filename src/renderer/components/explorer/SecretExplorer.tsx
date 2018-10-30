import TreeComponent, { Tree } from './TreeComponent'
import * as React from 'react'
import Gopass from '../../service/Gopass'
import ExampleTreeData from './ExampleTreeData'
import SecretsDirectoryService from '../../service/SecretsDirectoryService'

interface SecretExplorerState {
    tree?: Tree
}

const testLeafClick = async (secretName: string) => console.log(await Gopass.show(secretName))

export default class SecretExplorer extends React.Component<any, SecretExplorerState> {
    constructor(props: any) {
        super(props)
        this.state = { tree: undefined }
    }

    async componentDidMount() {
        const secretNames = await Gopass.getAllSecretNames()
        const tree: Tree = SecretsDirectoryService.secretPathsToTree(secretNames)
        this.setState({ tree })
        console.log(this.state)
    }

    render() {
        return (
            <TreeComponent
                tree={this.state.tree ? this.state.tree : ExampleTreeData}
                onLeafClick={testLeafClick}
            />
        )
    }
}
