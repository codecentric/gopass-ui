import * as React from 'react'
import * as t from 'react-treebeard'
import * as m from 'react-materialize'
import { globalStyle } from './TreeStyle'
import { deriveSecretIcon } from '../../secrets/SecretIcons'

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

t.decorators.Header = ({ style, node }: any) => {
    let iconType = node.toggled ? 'chevron_right' : 'folder'

    if (!node.children && node.entryId) {
        iconType = deriveSecretIcon(node.name)
    }

    return (
        <div style={ style.base }>
            <m.Icon small>
                { iconType }
            </m.Icon>

            { node.name }
        </div>
    )
}

export default class TreeComponent extends React.Component<TreeComponentProps, any> {
    public state: any = {}

    public render() {
        return (
            <>
                <t.Treebeard
                    data={ this.props.tree }
                    decorators={ t.decorators }
                    onToggle={ this.onToggle }
                    style={ globalStyle }
                />
            </>
        )
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
            this.onToggle(node.children[0], true)
        }
    }
}
