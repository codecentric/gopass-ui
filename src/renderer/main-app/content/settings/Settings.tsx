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
                </m.Row>
            </div>
        )
    }
}
