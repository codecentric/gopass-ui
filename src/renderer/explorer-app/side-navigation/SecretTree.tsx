import * as React from 'react'
import { History } from 'history'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import TreeComponent, { Tree } from '../../components/tree/TreeComponent'
import { AppState } from '../../state/AppState'

export interface SecretTreeProps {
    onSecretClick: (name: string) => void
    searchValue: string
    history: History
    tree: Tree
}

class SecretTree extends React.Component<SecretTreeProps, {}> {
    public render() {
        const { tree } = this.props
        return (
            <TreeComponent
                tree={ tree }
                onLeafClick={ this.onSecretClick }
            />
        )
    }

    private onSecretClick = async (name: string) => {
        this.props.history.push(`/secret/${btoa(name)}`)
    }
}

const mapStateToProps = (state: AppState) => ({
    tree: state.secrets.sideNavigationTree,
    searchValue: state.secrets.searchValue
})

export default withRouter(connect(mapStateToProps)(SecretTree) as any) as any
