import * as React from 'react'
import * as t from 'react-treebeard'
import * as m from 'react-materialize'
import { customStyle, globalStyle } from './TreebeardStyle'

export interface Child {
    name: string
    children?: Child[]
    loading?: boolean
    entryId?: any
}

export interface Tree {
    name: string
    toggled: boolean
    children?: Child[]
}

export interface TreeComponentProps {
    tree: Tree
    onLeafClick: (leafId: string) => void
}

const decorators = {
    ...t.decorators
}

decorators.Header = ({ style, node }: any) => {
    const iconType = node.children ? 'folder' : 'insert_drive_file'
    const iconStyle = { marginRight: '5px' }

    return (
        <div style={style.base}>
            <div style={style.title}>
                <m.Icon small style={iconStyle}>
                    {iconType}
                </m.Icon>

                {node.name}
            </div>
        </div>
    )
}

export default class TreeComponent extends React.Component<TreeComponentProps, any> {
    constructor(props: TreeComponentProps) {
        super(props)
        this.state = {}
        this.onToggle = this.onToggle.bind(this)
    }

    onToggle(node: any, toggled: boolean) {
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
    }

    render() {
        return (
            <div>
                <t.Treebeard
                    data={this.props.tree}
                    decorators={decorators}
                    onToggle={this.onToggle}
                    style={globalStyle}
                />
            </div>
        )
    }
}
