import * as React from 'react'
import * as m from 'react-materialize'

export default class Settings extends React.Component {
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    public render() {
        return (
            <>
                <h4>Settings</h4>
                <m.CardPanel>
                    [ ... ]
                </m.CardPanel>
            </>
        )
    }
}
