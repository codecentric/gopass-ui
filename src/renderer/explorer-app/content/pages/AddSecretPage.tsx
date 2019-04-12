import * as React from 'react'
import * as m from 'react-materialize'
import { History } from 'history'
import { withRouter } from 'react-router'
import Gopass from '../../../secrets/Gopass'
import { passwordSecretRegex } from '../../../secrets/deriveIconFromSecretName'

interface AddSecretPageState {
    name?: string
    value?: string
}

class AddSecretPage extends React.Component<{ history: History }, AddSecretPageState> {
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
        const nameLabel = `Secret name (${nameIndicatesPassword ? 'detected password' : 'e.g. store/my/new/secret/name'})`
        const valueLabel = `${nameIndicatesPassword ? 'Password' : 'Secret'} value`
        const shuffleButtonLabel = `Shuffle ${nameIndicatesPassword ? 'password' : 'value'}`

        return (
            <>
                <h4>New { nameIndicatesPassword ? 'Password' : 'Secret' }</h4>

                <m.CardPanel>
                    Adds new secrets to your Gopass stores. After clicking the Add-button, your new secret will be pushed to remote directly.
                </m.CardPanel>

                <m.Row>
                    <m.Input s={12} value={name} onChange={this.changeName} label={ nameLabel } />
                    <m.Input s={12} value={value} onChange={this.changeValue} label={ valueLabel } />
                    <m.Col s={12}>
                        <m.Button style={{ marginRight: '10px' }} onClick={this.shuffleRandomValue} waves='light'>{ shuffleButtonLabel }</m.Button>
                        <m.Button disabled={ !name || !value } onClick={this.addSecret} waves='light'>Save</m.Button>
                    </m.Col>
                </m.Row>
            </>
        )
    }

    private changeName = (_: any, name: string) => {
        this.setState({
            ...this.state,
            name
        })
    }

    private changeValue = (_: any, value: string) => {
        this.setState({
            ...this.state,
            value
        })
    }

    private generateRandomValue = () => {
        const randomSegment = () => Math.random().toString(36).slice(-8)
        return `${randomSegment()}-${randomSegment()}-${randomSegment()}-${randomSegment()}`
    }

    private shuffleRandomValue = () => {
        this.changeValue({}, this.generateRandomValue())
    }

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

export default withRouter(AddSecretPage as any) as any
