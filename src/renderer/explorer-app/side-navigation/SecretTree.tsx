import * as React from 'react'
import TreeComponent, { Tree } from '../../components/tree/TreeComponent'

export interface SecretTreeViewerProps {
    onSecretClick: (name: string) => void
    tree: Tree
}

export default class SecretTreeViewer extends React.Component<SecretTreeViewerProps, {}> {
    public render() {
        return <TreeComponent tree={this.props.tree} onLeafClick={this.props.onSecretClick} />
    }
}
