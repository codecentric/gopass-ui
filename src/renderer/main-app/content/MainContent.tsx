import * as React from 'react'
import * as m from 'react-materialize'
import { Route, match } from 'react-router-dom'
import { History } from 'history'

import SecretDetails from './crud/SecretDetails'
import EditSecret from './crud/EditSecret'
import CreateSecret from './crud/CreateSecret'
import FullActionNavigation from './navigation/FullActionNavigation'
import SmallActionNavigation from './navigation/SmallActionNavigation'
import Settings from './settings/Settings'

/* tslint:disable:jsx-no-lambda */
export default class MainContent extends React.Component<{ history: History }, {}> {
    render() {
        const { history } = this.props

        return (
            <div className='main-content'>
                <m.Row>
                    <m.Col s={12}>
                        <Route
                            path='/'
                            exact
                            render={() => (
                                <div>
                                    <FullActionNavigation history={history} />
                                    <m.CardPanel>
                                        Choose a secret from the navigation or use the actions at the top.
                                    </m.CardPanel>
                                </div>
                            )}
                        />
                        <Route
                            path='/create-new-secret'
                            exact
                            render={(props: { history: History }) => (
                                <div>
                                    <SmallActionNavigation history={history} />
                                    <CreateSecret history={history} />
                                </div>
                            )}
                        />
                        <Route
                            path='/:encodedSecretName/edit'
                            render={(props: { match: match<{ encodedSecretName: string }> }) => (
                                <div>
                                    <SmallActionNavigation history={history} />
                                    <EditSecret history={history} secretName={atob(props.match.params.encodedSecretName)} />
                                </div>
                            )
                            }
                        />
                        <Route
                            path='/:encodedSecretName/view'
                            render={(props: { match: match<{ encodedSecretName: string }> }) => {
                                const chosenSecretName = atob(props.match.params.encodedSecretName)

                                return (
                                    <div>
                                        <FullActionNavigation history={history} secretName={chosenSecretName} />
                                        <SecretDetails secretName={chosenSecretName} />
                                    </div>
                                )
                            }}
                        />
                        <Route
                            path='/settings'
                            exact
                            render={(props: { history: History }) => (
                                <div>
                                    <SmallActionNavigation history={history} />
                                    <Settings history={history} />
                                </div>
                            )}
                        />
                    </m.Col>
                </m.Row>
            </div>
        )
    }
}
