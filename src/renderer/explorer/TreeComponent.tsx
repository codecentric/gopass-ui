import * as React from 'react'
import * as t from 'react-treebeard'
import * as m from 'react-materialize'
import { globalStyle } from './TreebeardStyle'
import credentialIconMappings, { CredentialIconMapping } from './CredentialIconMappings'

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

const decorators = {
    ...t.decorators
}

decorators.Header = ({ style, node }: any) => {
    const iconStyle = { marginRight: '5px' }
    let iconType = 'folder'

    if (!node.children && node.entryId) {
        credentialIconMappings.forEach((mapping: CredentialIconMapping) => {
            const includesAnyCharacteristica = mapping.mustIncludeOnOf.find(needle =>
                node.name.includes(needle)
            )

            if (includesAnyCharacteristica) {
                iconType = mapping.icon
            }
        })

        if (iconType === 'folder') {
            iconType = 'comment'
        }
    }

    return (
        <div style={style.base}>
            <m.Icon small style={iconStyle}>
                {iconType}
            </m.Icon>

            {node.name}
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
