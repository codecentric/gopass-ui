import * as React from 'react'
import * as m from 'react-materialize'
import * as isValidElectronShortcut from 'electron-is-accelerator'

import { EnvironmentTest } from '../components/EnvironmentTest'
import { Settings } from '../../common/Settings'
import { ExternalLink } from '../../components/ExternalLink'

interface SettingsPageState {
    environmentTestSuccessful: boolean
    secretValueLength: number
    searchShortcut: string
}

export default function SettingsPage() {
    const [state, setState] = React.useState<SettingsPageState | undefined>(undefined)
    const [isShortcutValidationError, setShortcutValidationError] = React.useState<boolean>(false)

    React.useEffect(() => {
        const { environmentTestSuccessful } = Settings.getSystemSettings()
        const { secretValueLength, searchShortcut } = Settings.getUserSettings()
        setState({ environmentTestSuccessful, secretValueLength, searchShortcut })
    }, [])

    if (!state) {
        return null
    }

    return (
        <>
            <h4>Settings</h4>
            <m.CardPanel>
                <m.Row>
                    <m.Col s={12}>
                        <label className='active'>Characters for generated secrets: {state.secretValueLength}</label>
                        <p style={{ width: '33%' }} className='range-field'>
                            <input
                                type='range'
                                defaultValue={`${state.secretValueLength}`}
                                min='6'
                                onChange={event => {
                                    const value = parseInt(event.target.value, 10)
                                    Settings.updateUserSettings({ secretValueLength: value })
                                }}
                                max='200'
                            />
                        </p>
                    </m.Col>
                    <m.Input
                        s={4}
                        error={isShortcutValidationError ? 'error' : undefined}
                        defaultValue={state.searchShortcut}
                        onChange={(_: any, value: string) => {
                            const isValid = isValidElectronShortcut(value)
                            if (isValid) {
                                Settings.updateUserSettings({ searchShortcut: value })
                            }

                            setShortcutValidationError(!isValid)
                        }}
                        label={
                            <>
                                <span>Global search window shortcut</span>{' '}
                                <ExternalLink url='https://www.electronjs.org/docs/api/accelerator#available-modifiers'>(see all options)</ExternalLink>
                            </>
                        }
                    />
                </m.Row>
            </m.CardPanel>

            <h4>Environment Test</h4>
            {state.environmentTestSuccessful && <strong>🙌 The last test was successful 🙌</strong>}
            <m.CardPanel>
                <EnvironmentTest />
            </m.CardPanel>
        </>
    )
}
