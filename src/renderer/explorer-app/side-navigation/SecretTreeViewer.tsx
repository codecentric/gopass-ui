import * as React from 'react'
import { History } from 'history'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import TreeComponent, { Tree } from './TreeComponent'
import { AppState } from '../../state/AppState'

export interface SecretTreeViewerProps {
    onSecretClick: (name: string) => void
    searchValue: string
    history: History
    tree: Tree
}

class SecretTreeViewer extends React.Component<SecretTreeViewerProps, {}> {
    public render() {
        const { tree } = this.props
        return <TreeComponent tree={ tree } onLeafClick={ this.onSecretClick } />
    }

    private onSecretClick = async (name: string) => {
        this.props.history.push(`/secrets/${btoa(name)}/view`)
    }
}

const mapStateToProps = (state: AppState) => ({
    tree: state.secrets.sideNavigationTree,
    searchValue: state.secrets.searchValue
})

export default withRouter(connect(mapStateToProps)(SecretTreeViewer) as any) as any
