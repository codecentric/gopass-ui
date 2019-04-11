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
                    * SHORTCURT for Global Search Window<br />
                    * LIGHT and DARK theme<br />
                    * start On Login<br />
                    * show Tray<br />
                    * hide explorer when Global Search Window is closed<br />
                </m.CardPanel>

                <h4>System Check</h4>
                <m.CardPanel>
                    * Last Results<br />
                    * Run again
                </m.CardPanel>
            </>
        )
    }
}
