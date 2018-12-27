import * as React from 'react'
import * as m from 'react-materialize'

export default class Settings extends React.Component {
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div>
                <h4>Settings</h4>
                <m.CardPanel>
                    [ ... ]
                </m.CardPanel>
            </div>
        )
    }
}
