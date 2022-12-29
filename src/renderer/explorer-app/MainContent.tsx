import * as React from 'react'
import * as m from 'react-materialize'
import { Route } from 'react-router-dom'

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
            path='/secret/:encodedSecretName'
            element={<>
                <MainNavigation />
                <SecretDetailsPage />
            </>}
        />
        <Route
            path='/settings'
            element={<>
                <GoBackNavigation />
                <SettingsPage />
            </>}
        />
        <Route path='/mounts' element={<MountsPage />} />
        <Route
            path='/password-health'
            element={<>
                <GoBackNavigation />
                <PasswordHealthOverview />
            </>}
        />
        <Route path='/add-mount' element={<AddMountPage />} />
        <Route
            path='/add-secret'
            element={<>
                <GoBackNavigation />
                <AddSecretPage />
            </>}
        />
        <Route
            path='/'
            element={<>
                <MainNavigation />
                <HomePage />
            </>}
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
