import * as React from 'react'
import { History } from 'history'
import Gopass from '../../../secrets/Gopass'
import ActionButton from '../../common/ActionButton'
import { withRouter } from "react-router"

interface FullActionNavigationProps {
    history?: History
    secretName?: string
}

class FullActionNavigation extends React.Component<FullActionNavigationProps, any> {
    render() {
        const { history } = this.props

        return (
            <div style={ { paddingTop: '0.75rem' } }>
                <ActionButton icon='home' onClick={ () => history!.replace('/') } />
                <ActionButton
                    icon='refresh'
                    onClick={ this.refreshGopassStores }
                />
            </div>
        )
    }

    refreshGopassStores = async () => {
        try {
            await Gopass.sync()
            alert('Your stores have been synchronised successfully.')
        } catch (err) {
            alert(`Oops, something went wrong: ${JSON.stringify(err)}`)
        }
    }
}

export default withRouter(FullActionNavigation as any) as any
