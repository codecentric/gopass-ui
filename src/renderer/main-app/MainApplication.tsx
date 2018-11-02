import * as React from 'react'
import * as m from 'react-materialize'
import { Route, match } from 'react-router-dom'
import { History } from 'history'
import * as KeyboardEventHandler from 'react-keyboard-event-handler'

import SecretExplorer from './explorer/SecretExplorer'
import SecretDetails from './content/crud/SecretDetails'
import EditSecret from './content/crud/EditSecret'
import CreateSecret from './content/crud/CreateSecret'
import FullActionNavigation from './content/navigation/FullActionNavigation'
import SmallActionNavigation from './content/navigation/SmallActionNavigation'

import './MainApplication.css'
import Settings from "./content/settings/Settings"

export interface SecretState {
    secretName: string
    secretValue: string
}
interface MainApplicationState extends SecretState {
    searchValue: string
}
interface MainApplicationProps {
    history: History
}

export default class MainApplication extends React.Component<MainApplicationProps, MainApplicationState> {
    constructor(props: any) {
        super(props)
        this.state = {
            secretName: '',
            secretValue: '',
            searchValue: ''
        }
    }

    render() {
        const { secretValue, secretName, searchValue } = this.state
        const { history } = this.props

        return (
            <div className='wrapper'>
                <div className='secret-explorer'>
                    <KeyboardEventHandler handleKeys={['esc']} handleFocusableElements onKeyEvent={this.onCancelSearch} />
                    <m.Input className='search-bar' value={searchValue} placeholder='Search...' onChange={this.onSearchChange} />
                    <SecretExplorer searchValue={searchValue} onSecretClick={this.onSecretClick} />
                </div>

                <div className='main-content'>
                    <m.Row>
                        <m.Col s={12}>
                            <Route path='/' exact render={() => (
                                <div>
                                    <FullActionNavigation history={history} />
                                    <m.CardPanel>
                                        Choose a secret from the navigation or use the actions at the top.
                                    </m.CardPanel>
                                </div>
                            )} />
                            <Route path='/create-new-secret' exact render={(props: { history: History }) => (
                                <div>
                                    <SmallActionNavigation history={history} />
                                    <CreateSecret history={history} />
                                </div>
                            )} />
                            <Route path='/:encodedSecretName/edit' render={(props: { match: match<{ encodedSecretName: string }> }) => {
                                const chosenSecretName = atob(props.match.params.encodedSecretName)

                                return (
                                    <div>
                                        <SmallActionNavigation history={history} />
                                        <EditSecret history={history} secretName={chosenSecretName} />
                                    </div>
                                )
                            }} />
                            <Route path='/:encodedSecretName/view' render={(props: { match: match<{ encodedSecretName: string }> }) => {
                                const chosenSecretName = atob(props.match.params.encodedSecretName)

                                return (
                                    <div>
                                        <FullActionNavigation history={history} secretName={chosenSecretName} />
                                        <SecretDetails secretName={chosenSecretName} />
                                    </div>
                                )
                            }} />
                            <Route path='/settings' exact render={(props: { history: History }) => (
                                <div>
                                    <SmallActionNavigation history={history} />
                                    <Settings history={history} />
                                </div>
                            )} />
                        </m.Col>
                    </m.Row>
                </div>
            </div>
        )
    }

    private onSearchChange = (event: any, searchValue: string) => {
        this.setState({ ...this.state, searchValue })
    }

    private onCancelSearch = (event: any, searchValue: string) => {
        this.onSearchChange(event, '')
    }

    private onSecretClick = (secretName: string, secretValue: string) => {
        this.setState({ ...this.state, secretName, secretValue })

        this.props.history.replace(`/${btoa(secretName)}/view`)
    }
}
