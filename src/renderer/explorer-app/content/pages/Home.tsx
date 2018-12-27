import * as React from 'react'
import * as m from 'react-materialize'
import { shell } from 'electron'

export default class Home extends React.Component {
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    public render() {
        return (
            <div>
                <h4>Welcome to Gopass UI</h4>
                <m.CardPanel>
                    Choose a secret from the navigation or use the actions at the top.
                </m.CardPanel>

                <h4 className='m-top'>Global search window</h4>
                <m.CardPanel>
                    There is a globally usable search window that can be opened with:
                    <pre>cmd + shift + p</pre>
                </m.CardPanel>

                <h4 className='m-top'>Issues</h4>
                <m.CardPanel>
                    Please report any issues and problems to us on <a className='link' onClick={ this.openIssuesPage }>github</a>. We are very keen about your feedback and appreciate any help.
                </m.CardPanel>
            </div>
        )
    }

    private openIssuesPage = () => {
        shell.openExternal('https://github.com/codecentric/gopass-ui/issues')
    }
}
