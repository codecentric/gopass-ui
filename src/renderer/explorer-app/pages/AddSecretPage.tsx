import * as React from 'react'
import * as m from 'react-materialize'
import { RouteComponentProps, withRouter } from 'react-router'
import Gopass from '../../secrets/Gopass'
import { passwordSecretRegex } from '../../secrets/deriveIconFromSecretName'
import { PasswordStrengthInfo } from '../components/PasswordStrengthInfo'
import { PasswordRater } from '../password-health/PasswordRater'

import './AddSecretPage.css'

interface AddSecretPageState {
    name?: string
    value?: string
}

class AddSecretPage extends React.Component<RouteComponentProps, AddSecretPageState> {
    constructor(props: any) {
        super(props)
        this.state = {
            name: undefined,
            value: this.generateRandomValue()
        }
    }

    public render() {
        const { name, value } = this.state
        const nameIndicatesPassword = name ? passwordSecretRegex.test(name) : false
        const entity = nameIndicatesPassword ? 'Password' : 'Secret'
        const nameLabel = `Secret name (${nameIndicatesPassword ? 'detected password' : 'e.g. store/my/new/secret/name'})`
        const valueLabel = `${entity} value`
        const shuffleButtonLabel = `Shuffle ${nameIndicatesPassword ? 'password' : 'value'}`
        const currentPasswordValueRating = PasswordRater.ratePassword(value || '')

        return (
            <>
                <h4>New {entity}</h4>

                <m.CardPanel>
                    Adds new secrets to your Gopass stores. After clicking the Add-button, your new secret will be pushed to remote directly.
                </m.CardPanel>

                <m.Row>
                    <m.Input s={12} value={name} onChange={this.changeName} label={nameLabel}/>
                    <div className='secret-value-field-row'>
                        <label className='secret-value-label'>{valueLabel}</label>
                        <textarea className='secret-value-textarea' placeholder={valueLabel} value={value} onChange={this.changeValue}/>
                    </div>
                    <PasswordStrengthInfo
                        strength={currentPasswordValueRating.health}
                        labelContent={`${entity} value strength`}
                    />
                    <m.Col s={12}>
                        <m.Button style={{ marginRight: '10px' }} onClick={this.shuffleRandomValue} waves='light'>{shuffleButtonLabel}</m.Button>
                        <m.Button disabled={!name || !value} onClick={this.addSecret} waves='light'>Save</m.Button>
                    </m.Col>
                </m.Row>
            </>
        )
    }

    private changeName = (_: any, name: string) => this.setState({ name })
    private changeValue = (event: any) => this.setState({ value: event.target.value })

    private generateRandomValue = (length = 50) => {
        const chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890'
        let randomPassword = ''

        for (let x = 0; x < length; x++) {
            const randomIndex = Math.floor(Math.random() * chars.length)
            randomPassword += chars.charAt(randomIndex)
        }

        return randomPassword
    }

    private shuffleRandomValue = () => this.setState({ value: this.generateRandomValue() })

    private addSecret = async () => {
        const { name, value } = this.state

        if (name && value) {
            const { history } = this.props

            try {
                await Gopass.addSecret(name, value)
                history.replace(`/secret/${btoa(name)}?added`)
            } catch (e) {
                console.info('Error during adding a secret', e)
            }
        }
    }
}

export default withRouter(AddSecretPage)
