import * as React from 'react'
import * as m from 'react-materialize'

import { EnvironmentTest } from '../components/EnvironmentTest'
import { LatestVersionInfo } from '../components/LastVersionInfo'
import { ExternalLink } from '../../components/ExternalLink'
import { Settings } from '../../common/Settings'

const OptionalSetupInstructions = () => {
    const { environmentTestSuccessful } = Settings.getSystemSettings()

    return environmentTestSuccessful ? null : (
        <>
            <h4>Environment Test</h4>
            <m.CardPanel>
                <EnvironmentTest />
            </m.CardPanel>
        </>
    )
}

const HomePage = () => {
    const { searchShortcut } = Settings.getUserSettings()

    return (
        <>
            <h3>Welcome to Gopass UI</h3>
            <OptionalSetupInstructions />

            <m.CardPanel>
                Choose a secret from the navigation or use the actions at the top. <LatestVersionInfo />
            </m.CardPanel>

            <h4 className='m-top'>Global search window</h4>
            <m.CardPanel>
                The configured shortcut for the global search window (quick secret clipboard-copying) is:
                <pre>{searchShortcut.replace(/\+/g, ' + ')}</pre>
            </m.CardPanel>

            <h4 className='m-top'>Issues</h4>
            <m.CardPanel>
                Please report any issues and problems to us on <ExternalLink url='https://github.com/codecentric/gopass-ui/issues'>Github</ExternalLink>.<br />
                We are very keen about your feedback and appreciate any help.
            </m.CardPanel>
        </>
    )
}

export default HomePage
