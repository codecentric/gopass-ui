import * as React from 'react'
import * as m from 'react-materialize'

import { EnvironmentTest } from '../components/EnvironmentTest'
import { Settings } from '../../common/Settings'

export default function SettingsPage() {
    const { environmentTestSuccessful } = Settings.getSystemSettings()
    return (
        <>
            <h4>Environment Test</h4>
            {environmentTestSuccessful && <strong>🙌 The last test was successful 🙌</strong>}
            <m.CardPanel>
                <EnvironmentTest/>
            </m.CardPanel>
        </>
    )
}
