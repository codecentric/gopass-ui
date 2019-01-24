import * as React from 'react'
import * as m from 'react-materialize'
import { Route, match } from 'react-router-dom'

import SecretDetails from './pages/SecretDetails'
import Settings from './pages/Settings'
import Home from './pages/Home'
import MainNavigation from './navigation/MainNavigation'
import GoBackNavigation from './navigation/GoBackNavigation'
import Notification from '../../notifications/Notification'
import PasswordHealthOverview from '../../password-health/PasswordHealthOverview'

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
                                <>
                                    <MainNavigation />
                                    <Home />
                                </>
                            ) }
                        />
                        <Route
                            path='/secrets/:encodedSecretName/view'
                            component={ (props: { match: match<{ encodedSecretName: string }> }) => {
                                const chosenSecretName = atob(props.match.params.encodedSecretName)

                                return (
                                    <>
                                        <MainNavigation />
                                        <SecretDetails
                                            secretName={ chosenSecretName }
                                        />
                                    </>
                                )
                            } }
                        />
                        <Route
                            path='/settings'
                            exact
                            render={ () => (
                                <>
                                    <GoBackNavigation />
                                    <Settings />
                                </>
                            ) }
                        />
                        <Route
                            path='/password-health'
                            exact
                            render={ () => (
                                <>
                                    <GoBackNavigation />
                                    <PasswordHealthOverview />
                                </>
                            ) }
                        />
                    </m.Col>
                </m.Row>
            </div>
        )
    }
}
