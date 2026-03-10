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
}

export default function TreeComponent({ tree, onLeafClick }: TreeComponentProps) {
    const [selectedNode, setSelectedNode] = React.useState<any>(undefined)

    const onToggle = (node: any, toggled: boolean) => {
        if (!node.children || node.children.length === 0) {
            onLeafClick(node.path)
        }

        if (selectedNode) {
            selectedNode.active = false
        }

        node.active = true

        if (node.children) {
            node.toggled = toggled
        }
        setSelectedNode(node)

        if (node.children && node.children.length === 1) {
            onToggle(node.children[0], true)
        }
    }

    return <t.Treebeard data={tree} decorators={{ ...t.decorators, Header }} onToggle={onToggle} style={globalStyle} />
}
