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
                <m.CardPanel>
                    <h2 className='panel-headline'>Help</h2>
                    Choose a secret from the navigation or use the actions at the top.
                </m.CardPanel>
            </div>
        )
    }
}
