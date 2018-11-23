import * as React from 'react'
import * as m from 'react-materialize'
import Gopass from '../../../secrets/Gopass'
import { History } from 'history'

interface EditSecretState { secretValue: string, changedSecretValue?: string }

export default class EditSecret extends React.Component<{ secretName: string, history: History }, EditSecretState, any> {
    constructor(props: any) {
        super(props)
        this.state = { secretValue: '' }

        this.onChangeValue = this.onChangeValue.bind(this)
        this.save = this.save.bind(this)
    }

    render() {
        const { changedSecretValue, secretValue } = this.state

        return (
            <div>
                <h4>{this.props.secretName}</h4>

                <textarea value={ changedSecretValue ? changedSecretValue : secretValue} onChange={this.onChangeValue} />

                <m.Button onClick={this.save} waves='light'>
                    Save<m.Icon left>save</m.Icon>
                </m.Button>
            </div>
        )
    }

    async componentDidMount() {
        const secretValue = await Gopass.show(this.props.secretName)
        this.setState({ secretValue })
    }

    async save() {
        const { secretName } = this.props
        // TODO: gopass save
        this.props.history.replace(`/${btoa(secretName)}/view`)
        alert(`The value of secret ${secretName} has been updated!`)

    }

    onChangeValue(event: any) {
        this.setState({ ...this.state, changedSecretValue: event.target.value })
    }
}
