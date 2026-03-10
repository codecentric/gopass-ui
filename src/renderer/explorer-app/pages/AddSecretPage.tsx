import * as React from 'react'
import * as m from 'react-materialize'
import { useNavigate } from 'react-router-dom'
import Gopass from '../../secrets/Gopass'
import { passwordSecretRegex } from '../../secrets/deriveIconFromSecretName'
import { PasswordStrengthInfo } from '../components/PasswordStrengthInfo'
import { PasswordRater } from '../password-health/PasswordRater'

import './AddSecretPage.css'
import { Settings } from '../../common/Settings'
import { useSecretsContext } from '../SecretsProvider'

const generateRandomValue = (length: number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890'
    let randomPassword = ''

    for (let x = 0; x < length; x++) {
        const randomIndex = Math.floor(Math.random() * chars.length)
        randomPassword += chars.charAt(randomIndex)
    }

    return randomPassword
}

export default function AddSecretPage() {
    const navigate = useNavigate()
    const secretsContext = useSecretsContext()
    const [name, setName] = React.useState<string | undefined>(undefined)
    const [value, setValue] = React.useState<string | undefined>(generateRandomValue(Settings.getUserSettings().secretValueLength))

    const nameIndicatesPassword = name ? passwordSecretRegex.test(name) : false
    const entity = nameIndicatesPassword ? 'Password' : 'Secret'
    const nameLabel = `Secret name (${nameIndicatesPassword ? 'detected password' : 'e.g. store/my/new/secret/name'})`
    const valueLabel = `${entity} value`
    const shuffleButtonLabel = `Shuffle ${nameIndicatesPassword ? 'password' : 'value'}`
    const currentPasswordValueRating = PasswordRater.ratePassword(value || '')

    const changeName = (_: any, newName: string) => setName(newName)
    const changeValue = (event: any) => setValue(event.target.value)
    const shuffleRandomValue = () => setValue(generateRandomValue(Settings.getUserSettings().secretValueLength))

    const addSecret = async () => {
        if (name && value) {
            try {
                await Gopass.addSecret(name, value)
                await secretsContext.reloadSecretNames()
                navigate(`/secret/${btoa(name)}?added`, { replace: true })
            } catch (e) {
                console.info('Error during adding a secret', e)
            }
        }
    }

    return (
        <>
            <h4>New {entity}</h4>

            <m.CardPanel>
                Adds new secrets to your Gopass stores. After clicking the Add-button, your new secret will be pushed to remote directly.
            </m.CardPanel>

            <m.Row>
                <m.Input s={12} value={name} onChange={changeName} label={nameLabel} />
                <div className='secret-value-field-row'>
                    <label className='secret-value-label'>{valueLabel}</label>
                    <textarea className='secret-value-textarea' placeholder={valueLabel} value={value} onChange={changeValue} />
                </div>
                <PasswordStrengthInfo strength={currentPasswordValueRating.health} labelContent={`${entity} value strength`} />
                <m.Col s={12}>
                    <m.Button style={{ marginRight: '10px' }} onClick={shuffleRandomValue} waves='light'>
                        {shuffleButtonLabel}
                    </m.Button>
                    <m.Button disabled={!name || !value} onClick={addSecret} waves='light'>
                        Save
                    </m.Button>
                </m.Col>
            </m.Row>
        </>
    )
}
