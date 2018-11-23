import * as React from 'react'
import * as m from 'react-materialize'
import Gopass, { HistoryEntry } from '../../../secrets/Gopass'

const copySecretToClipboard = (secretName: string) => async () => {
    await Gopass.copy(secretName)
    alert('Secret has been copied to your clipboard.')
}

interface SecretDetailsState {
    secretValue: string
    historyEntries: HistoryEntry[]
}

export default class SecretDetails extends React.Component<{ secretName: string }, SecretDetailsState> {
    constructor(props: any) {
        super(props)
        this.state = { secretValue: '', historyEntries: [] }
    }

    render() {
        const { secretName } = this.props
        const { secretValue, historyEntries } = this.state

        return (
            <div>
                <h4>Secret</h4>
                <m.Card
                    title={secretName}
                    actions={
                        [
                            <a key='copy-clipboard' onClick={copySecretToClipboard(secretName)}>
                                Copy to clipboard
                            </a>
                        ]
                    }
                >
                    {secretValue}
                </m.Card>

                <h4 className='m-top'>History</h4>
                <m.Table>
                    <thead>
                        <tr>
                            <th data-field='timestamp'>Time</th>
                            <th data-field='author'>Author</th>
                            <th data-field='message'>Message</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            historyEntries.map(entry => (
                                <tr key={entry.hash}>
                                    <td>{entry.timestamp}</td>
                                    <td>{entry.author}</td>
                                    <td>{entry.message}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </m.Table>
            </div>
        )
    }

    async createState(secretName: string) {
        const [secretValue, historyEntries] = await Promise.all([
            Gopass.show(secretName),
            Gopass.history(secretName)
        ])

        this.setState({ secretValue, historyEntries })
    }

    async componentDidMount() {
        await this.createState(this.props.secretName)
    }

    async componentWillReceiveProps(props: { secretName: string }) {
        await this.createState(props.secretName)
    }
}
