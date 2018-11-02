import * as React from 'react'
import * as m from 'react-materialize'
import { History } from 'history'

export default class Settings extends React.Component<{ history: History }, {}> {
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div>
                <m.Row>
                    <h1>Settings</h1>
                </m.Row>
                <m.Row>
                    <m.Input type='text' label='Name' onChange={this.onNameChange} s={12} />
                    <m.Input type='text' label='Secret' onChange={this.onSecretChange} s={12} />
                </m.Row>
            </div>
        )
    }

    onNameChange = (_: any, name: string) => {
        this.setState({ ...this.state, name })
    }

    onSecretChange = (_: any, secret: string) => {
        this.setState({ ...this.state, secret })
    }
}
