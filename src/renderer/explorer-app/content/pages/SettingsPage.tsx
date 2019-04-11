import * as React from 'react'
import * as m from 'react-materialize'

import { EnvironmentTest } from '../components/EnvironmentTest'
import Settings from '../../../Settings'

export default function SettingsPage() {
    const { environmentTestSuccessful } = Settings.getSystemSettings()

    return <>
        <h4>Settings</h4>
        <m.CardPanel>
            * SHORTCURT for Global Search Window<br/>
            * LIGHT and DARK theme<br/>
            * start On Login<br/>
            * show Tray<br/>
            * hide explorer when Global Search Window is closed<br/>
        </m.CardPanel>

        <h4>Environment Test</h4>
        {environmentTestSuccessful && <strong>🙌 The last test was successful 🙌</strong>}
        <m.CardPanel>
            <EnvironmentTest/>
        </m.CardPanel>
    </>
}
