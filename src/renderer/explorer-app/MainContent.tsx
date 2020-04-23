import * as React from 'react'
import * as m from 'react-materialize'
import { match, Route } from 'react-router-dom'

import SettingsPage from './pages/SettingsPage'
import HomePage from './pages/HomePage'
import MainNavigation from './components/MainNavigation'
import GoBackNavigation from '../components/GoBackNavigationButton'
import Notification from '../common/notifications/Notification'
import NotificationProvider from '../common/notifications/NotificationProvider'
import PasswordHealthOverview from './pages/PasswordHealthPage'
import AddSecretPage from './pages/AddSecretPage'
import SecretDetailsPage from './pages/details/SecretDetailsPage'
import { useSecretsContext } from './SecretsProvider'

function MainContentRoutes() {
    const { reloadSecretNames } = useSecretsContext()

    return <>
        <Route
            path='/'
            exact
            render={() => (
                <>
                    <MainNavigation/>
                    <HomePage/>
                </>
            )}
        />
        <Route
            path='/secret/:encodedSecretName'
            component={(props: { match: match<{ encodedSecretName: string }>, location: { search?: string } }) => {
                const secretName = atob(props.match.params.encodedSecretName)
                const isAdded = props.location.search ? props.location.search === '?added' : false

                return (
                    <>
                        <MainNavigation/>
                        <SecretDetailsPage
                            onSecretDelete={reloadSecretNames}
                            secretName={secretName}
                            isAdded={isAdded}
                        />
                    </>
                )
            }}
        />
        <Route
            path='/settings'
            exact
            render={() => (
                <>
                    <GoBackNavigation/>
                    <SettingsPage/>
                </>
            )}
        />
        <Route
            path='/password-health'
            exact
            render={() => (
                <>
                    <GoBackNavigation/>
                    <PasswordHealthOverview/>
                </>
            )}
        />
        <Route
            path='/add-secret'
            exact
            render={() => (
                <>
                    <GoBackNavigation/>
                    <AddSecretPage onSecretSave={reloadSecretNames} />
                </>
            )}
        />
    </>
}

function MainContent() {
    return <div className='main-content'>
        <NotificationProvider>
            <Notification/>
            <m.Row>
                <m.Col s={12}>
                    <MainContentRoutes/>
                </m.Col>
            </m.Row>
        </NotificationProvider>
    </div>
}

export default MainContent
