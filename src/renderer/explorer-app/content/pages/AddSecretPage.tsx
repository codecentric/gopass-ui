import * as React from 'react'
import * as m from 'react-materialize'
import { History } from 'history'
import { withRouter } from 'react-router'
import Gopass from '../../../secrets/Gopass'

interface AddSecretPageState {
    name: string
    value: string
}

class AddSecretPage extends React.Component<{ history: History }, AddSecretPageState> {
    constructor(props: any) {
        super(props)
        this.state = {
            name: '',
            value: ''
        }
    }

    public render() {
        const { name, value } = this.state

        return (
            <>
                <h4>New Secret</h4>

                <m.CardPanel>
                    Adds new secrets to your Gopass stores. After clicking the Add-button, your new secret will be pushed to remote directly.
                </m.CardPanel>

                <m.Row>
                    <m.Input s={12} value={name} onChange={this.changeName} label='Secret name (e.g. store/my/new/secret/name)' />
                    <m.Input s={12} value={value} onChange={this.changeValue} label='Secret value' />
                    <m.Col s={12}>
                        <m.Button disabled={ !name || !value } onClick={this.addSecret} waves='light'>Add Secret</m.Button>
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

    private addSecret = async () => {
        const { name, value } = this.state
        const { history } = this.props

        try {
            await Gopass.addSecret(name, value)
            history.replace(`/secrets/${btoa(name)}/view?added`)
        } catch (e) {
            console.log('Error during adding a secret', e)
        }
    }
}

export default withRouter(AddSecretPage as any) as any
