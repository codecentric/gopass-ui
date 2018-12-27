import * as React from 'react'
import * as m from 'react-materialize'
import { Route, match } from 'react-router-dom'

import SecretDetails from './pages/SecretDetails'
import Settings from './pages/Settings'
import Home from './pages/Home'
import MainNavigation from './navigation/MainNavigation'
import GoBackNavigation from './navigation/GoBackNavigation'
import Notification from '../../notifications/Notification'

/* tslint:disable:jsx-no-lambda */
export default class MainContent extends React.Component {
    public render() {
        return (
            <div className='main-content'>
                <Notification />
                <m.Row>
                    <m.Col s={ 12 }>
                        <Route
                            path='/'
                            exact
                            render={ () => (
                                <div>
                                    <MainNavigation />
                                    <Home />
                                </div>
                            ) }
                        />
                        <Route
                            path='/secrets/:encodedSecretName/view'
                            render={ (props: { match: match<{ encodedSecretName: string }> }) => {
                                const chosenSecretName = atob(props.match.params.encodedSecretName)

                                return (
                                    <div>
                                        <MainNavigation />
                                        <SecretDetails secretName={ chosenSecretName } />
                                    </div>
                                )
                            } }
                        />
                        <Route
                            path='/settings'
                            exact
                            render={ () => (
                                <div>
                                    <GoBackNavigation />
                                    <Settings />
                                </div>
                            ) }
                        />
                    </m.Col>
                </m.Row>
            </div>
        )
    }
}
