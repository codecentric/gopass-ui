import * as React from 'react'
import * as m from 'react-materialize'
import { shell } from 'electron'
import GithubService, { GithubTag } from '../../GithubService'

export default class Home extends React.Component<any, { tags: GithubTag[] }> {
    constructor(props: any) {
        super(props)
        this.state = {
            tags: []
        }
    }

    public async componentDidMount() {
        const tags = await GithubService.getTagsOfRepository('codecentric', 'gopass-ui')
        this.setState({ tags })
    }

    public render() {
        const { tags } = this.state
        const lastTag = tags[tags.length - 1]
        const lastTagName = lastTag ? lastTag.ref.slice(10, lastTag.ref.length) : ''

        return (
            <>
                <h4>Welcome to Gopass UI</h4>
                <m.CardPanel>
                    Choose a secret from the navigation or use the actions at the top.
                    {lastTag && (
                        <>
                            {' '}
                            Make sure you got the latest version of Gopass UI so you don't miss any update:{' '}
                            <a onClick={this.openLatestReleasePage}>{`${lastTagName} on Github`}</a>
                        </>
                    )}
                </m.CardPanel>

                <h4 className='m-top'>Global search window</h4>
                <m.CardPanel>
                    The shortcut for the global search window for quick secret clipboard-copying is:
                    <pre>(cmd || ctrl) + shift + p</pre>
                </m.CardPanel>

                <h4 className='m-top'>Issues</h4>
                <m.CardPanel>
                    Please report any issues and problems to us on{' '}
                    <a className='link' onClick={ this.openIssuesPage }>
                        Github
                    </a>. We are very keen about your feedback and appreciate any help.
                </m.CardPanel>
            </>
        )
    }

    private openLatestReleasePage = () => {
        shell.openExternal('https://github.com/codecentric/gopass-ui/releases/latest')
    }

    private openIssuesPage = () => {
        shell.openExternal('https://github.com/codecentric/gopass-ui/issues')
    }
}
