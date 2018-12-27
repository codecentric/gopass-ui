import * as React from 'react'
import * as m from 'react-materialize'
import { Route, match } from 'react-router-dom'

import SecretDetails from './crud/SecretDetails'
import FullActionNavigation from './navigation/FullActionNavigation'
import GoBackNavigation from './navigation/GoBackNavigation'
import Settings from './settings/Settings'
import Notification from '../../notifications/Notification'

/* tslint:disable:jsx-no-lambda */
export default class MainContent extends React.Component {
    render() {
        return (
            <div className='main-content'>
                <Notification />
                <m.Row>
                    <m.Col s={12}>
                        <Route
                            path='/'
                            exact
                            render={() => (
                                <div>
                                    <FullActionNavigation />
                                    <m.CardPanel>
                                        Choose a secret from the navigation or use the actions at the top.
                                    </m.CardPanel>
                                </div>
                            )}
                        />
                        <Route
                            path='/:encodedSecretName/view'
                            render={(props: { match: match<{ encodedSecretName: string }> }) => {
                                const chosenSecretName = atob(props.match.params.encodedSecretName)

                                return (
                                    <div>
                                        <FullActionNavigation secretName={chosenSecretName} />
                                        <SecretDetails secretName={chosenSecretName} />
                                    </div>
                                )
                            }}
                        />
                        <Route
                            path='/settings'
                            exact
                            render={() => (
                                <div>
                                    <GoBackNavigation />
                                    <Settings />
                                </div>
                            )}
                        />
                    </m.Col>
                </m.Row>
            </div>
        )
    }
}
