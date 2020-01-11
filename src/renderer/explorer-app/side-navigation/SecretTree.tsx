import * as React from 'react'
import TreeComponent, { Tree } from '../../components/tree/TreeComponent'

export interface SecretTreeViewerProps {
    onSecretClick: (name: string) => void
    tree: Tree
    selectedSecretName?: string
}

export default class SecretTreeViewer extends React.Component<SecretTreeViewerProps, {}> {
    public render() {
        return (
            <TreeComponent
                tree={this.props.tree}
                selectedPath={this.props.selectedSecretName}
                onLeafClick={this.props.onSecretClick}
            />
        )
    }
}
