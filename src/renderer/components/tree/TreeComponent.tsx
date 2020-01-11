import * as React from 'react'
import * as t from 'react-treebeard'
import { globalStyle } from './TreeStyle'
import { TreeHeader as Header } from './TreeHeader'

export interface Tree {
    name: string
    toggled?: boolean
    loading?: boolean
    children?: Tree[]
    path: string
}

export interface TreeComponentProps {
    tree: Tree
    onLeafClick: (leafId: string) => void
    selectedPath?: string
}

interface TreeComponentState { selectedNode?: any }
export default class TreeComponent extends React.Component<TreeComponentProps, TreeComponentState> {
    public state: TreeComponentState = {}

    public render() {
        return <t.Treebeard
            data={this.props.tree}
            decorators={{ ...t.decorators, Header }}
            onToggle={this.onToggle}
            style={globalStyle}
        />
    }

    public componentWillReceiveProps(nextProps: Readonly<TreeComponentProps>): void {
        // maybe extendable with a check whether the nextProps.tree contains changes compared to props.tree
        if (nextProps.selectedPath) {
            const selectedNode = this.findSelectedNodeFromPath(nextProps.tree, nextProps.selectedPath)

            if (selectedNode) {
                selectedNode.active = false
                this.state.selectedNode = selectedNode
            }
        }
    }

    private findSelectedNodeFromPath(tree: Tree, selectedPath: string): any {
        if (tree.path === selectedPath) {
            return tree
        }

        if (!!tree.children && tree.children.length > 0) {
            for (const child of tree.children) {
                const node = this.findSelectedNodeFromPath(child, selectedPath)
                if (node) {
                    return node
                }
            }
        }
    }

    private onToggle = (node: any, toggled: boolean) => {
        // if no children (thus being a leaf and thereby an entry), trigger the handler
        if ((!node.children || node.children.length === 0)) {
            this.props.onLeafClick(node.path)
        }

        // previously selected node is no more active
        if (this.state.selectedNode) {
            this.state.selectedNode.active = false
        }

        // newly selected node shall be active
        node.active = true

        // ...and toggled if having children
        if (node.children) {
            node.toggled = toggled
        }
        this.setState({ selectedNode: node })

        if (node.children && node.children.length === 1) {
            this.onToggle(node.children[ 0 ], true)
        }
    }
}
