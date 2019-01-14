import * as React from 'react'
import * as m from 'react-materialize'
import Gopass, { HistoryEntry } from '../../../secrets/Gopass'
import PaginatedTable from '../../common/PaginatedTable';

interface SecretDetailsState {
    secretValue: string
    historyEntries: HistoryEntry[]
}

interface SecretDetailsViewProps {
    secretName: string
    copySecretToClipboard?: (secretName: string) => void
}

export default class SecretDetailsView extends React.Component<SecretDetailsViewProps, SecretDetailsState> {
    constructor(props: SecretDetailsViewProps) {
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
                    title={ secretName }
                    actions={ [
                        <a key='copy-clipboard' className='link' onClick={ () => this.props.copySecretToClipboard!(secretName) }>Copy to clipboard</a>
                    ] }
                >
                    { secretValue }
                </m.Card>

                <h4 className='m-top'>History</h4>
                <PaginatedTable
                    columns={ [
                        { fieldName: 'timestamp', label: 'Time' },
                        { fieldName: 'author', label: 'Author' },
                        { fieldName: 'message', label: 'Message' }
                    ] }
                    rows={ historyEntries.map(entry => ({ ...entry, id: entry.hash })) }
                />
            </div>
        )
    }

    async createState(secretName: string) {
        const [ secretValue, historyEntries ] = await Promise.all([
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
