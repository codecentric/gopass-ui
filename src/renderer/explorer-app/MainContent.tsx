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
import MountsPage from './pages/MountsPage'
import AddMountPage from './pages/AddMountPage'

const Routes = () => (
    <>
        <Route
            path='/'
            exact
            render={() => (
                <>
                    <MainNavigation />
                    <HomePage />
                </>
            )}
        />
        <Route
            path='/secret/:encodedSecretName'
            component={(props: { match: match<{ encodedSecretName: string }>; location: { search?: string } }) => {
                const secretName = atob(props.match.params.encodedSecretName)
                const isAdded = props.location.search ? props.location.search === '?added' : false

                return (
                    <>
                        <MainNavigation />
                        <SecretDetailsPage secretName={secretName} isAdded={isAdded} />
                    </>
                )
            }}
        />
        <Route
            path='/settings'
            exact
            render={() => (
                <>
                    <GoBackNavigation />
                    <SettingsPage />
                </>
            )}
        />
        <Route path='/mounts' exact render={() => <MountsPage />} />
        <Route
            path='/password-health'
            exact
            render={() => (
                <>
                    <GoBackNavigation />
                    <PasswordHealthOverview />
                </>
            )}
        />
        <Route path='/add-mount' exact render={() => <AddMountPage />} />
        <Route
            path='/add-secret'
            exact
            render={() => (
                <>
                    <GoBackNavigation />
                    <AddSecretPage />
                </>
            )}
        />
    </>
)

const MainContent = () => (
    <div className='main-content'>
        <NotificationProvider>
            <Notification />
            <m.Row>
                <m.Col s={12}>
                    <Routes />
                </m.Col>
            </m.Row>
        </NotificationProvider>
    </div>
)

export default MainContent
