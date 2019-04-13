import * as React from 'react'
import * as t from 'react-treebeard'
import { globalStyle } from './TreeStyle'
import { TreeHeader as Header } from './TreeHeader'

export interface Tree {
    name: string
    toggled?: boolean
    loading?: boolean
    children?: Tree[]
    entryId?: any
}

export interface TreeComponentProps {
    tree: Tree
    onLeafClick: (leafId: string) => void
}

export default class TreeComponent extends React.Component<TreeComponentProps, any> {
    public state: any = {}

    public render() {
        return <t.Treebeard
            data={this.props.tree}
            decorators={{ ...t.decorators, Header }}
            onToggle={this.onToggle}
            style={globalStyle}
        />
    }

    private onToggle = (node: any, toggled: boolean) => {
        if ((!node.children || node.children.length === 0) && !!node.entryId) {
            this.props.onLeafClick(node.entryId)
        }

        if (this.state.cursor) {
            this.state.cursor.active = false
        }
        node.active = true

        if (node.children) {
            node.toggled = toggled
        }
        this.setState({ cursor: node })

        if (node.children && node.children.length === 1) {
            this.onToggle(node.children[ 0 ], true)
        }
    }
}
