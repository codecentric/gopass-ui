import * as React from 'react'
import { History } from 'history'
import Gopass from '../../../secrets/Gopass'
import ActionButton from '../../common/ActionButton'
import ActionNavigationWrapper from './ActionNavigationWrapper'

const noop = () => undefined
const routeTo = (history: History) => (route: string) => () => history.replace(route)

interface FullActionNavigationProps {
    history: History
    secretName?: string
}

export default class FullActionNavigation extends React.Component<FullActionNavigationProps, any> {

    render() {
        const { secretName, history } = this.props

        return (
            <ActionNavigationWrapper>
                <ActionButton icon='add' onClick={routeTo(history)(`/create-new-secret`)} />
                <ActionButton
                    icon='refresh'
                    onClick={this.refreshGopassStores}
                />
                {
                    !!secretName ?
                        <ActionButton
                            icon='edit'
                            onClick={routeTo(history)(`/${btoa(secretName)}/edit`)}
                        /> : null
                }
            </ActionNavigationWrapper>
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
