import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import TreeComponent, { Tree } from '../../components/tree/TreeComponent'

export interface SecretTreeProps extends RouteComponentProps {
    tree: Tree
}

const SecretTree = ({ tree, history }: SecretTreeProps) => (
    <TreeComponent
        tree={ tree }
        onLeafClick={ (name: string) => history.replace(`/secret/${btoa(name)}`) }
    />
)

export default withRouter(SecretTree)
