import * as React from 'react'
import * as m from 'react-materialize'
import Gopass from '../../../secrets/Gopass'
import { History } from 'history'

export default class CreateSecret extends React.Component<{ history: History }, { name?: string, secret?: string }> {
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div>
                <m.Row>
                    <m.Input type='text' label='Name' onChange={this.onNameChange} s={12} />
                    <m.Input type='text' label='Secret' onChange={this.onSecretChange} s={12} />
                </m.Row>

                <m.Button onClick={this.save} waves='light'>
                    Save<m.Icon left>save</m.Icon>
                </m.Button>
            </div>
        )
    }

    onNameChange = (_: any, name: string) => {
        this.setState({ ...this.state, name })
    }

    onSecretChange = (_: any, secret: string) => {
        this.setState({ ...this.state, secret })
    }

    save = async () => {
        const { name, secret } = this.state

        if (name && secret) {
            this.props.history.replace(`/${btoa(name)}/view`)
            alert(`The value of secret "${name}" has been saved!`)
        }
    }
}