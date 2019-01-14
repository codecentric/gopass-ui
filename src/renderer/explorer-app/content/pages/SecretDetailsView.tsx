    import * as React from 'react'
    import * as m from 'react-materialize'
import Gopass, { HistoryEntry } from '../../../secrets/Gopass'
import PaginatedTable from '../../common/PaginatedTable'
import { deriveSecretIcon, passwordSecretRegex } from '../../side-navigation/SecretIcons'
import { ratePassword, PasswordRatingResult } from '../../../password-health/PasswordRules'
import PasswordRatingComponent from '../../../password-health/PasswordRatingComponent';

interface SecretDetailsState {
    secretValue: string
    historyEntries: HistoryEntry[]
    isPassword: boolean
    passwordRating: PasswordRatingResult | undefined
}

interface SecretDetailsViewProps {
    secretName: string
    copySecretToClipboard?: (secretName: string) => void
}

export default class SecretDetailsView extends React.Component<SecretDetailsViewProps, SecretDetailsState> {
    constructor(props: SecretDetailsViewProps) {
        super(props)
        this.state = { secretValue: '', historyEntries: [], passwordRating: undefined, isPassword: false }
    }

    render() {
        const { secretName } = this.props
        const { secretValue, historyEntries, isPassword, passwordRating } = this.state

        return (
            <div>
                <h4>Secret</h4>
                <m.Card
                    title={ <>{ secretName } <m.Icon>{ deriveSecretIcon(secretName) }</m.Icon></> }
                    actions={ [
                        <a key='copy-clipboard' className='link' onClick={ () => this.props.copySecretToClipboard!(secretName) }>Copy to clipboard</a>
                    ] }
                >
                    { secretValue }
                </m.Card>

                {
                    isPassword && passwordRating &&
                        <>
                            <h4 className='m-top'>Password Strength</h4>
                            <PasswordRatingComponent passwordRating={ passwordRating } />
                        </>
                }

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

    private async createState(secretName: string) {
        const [ secretValue, historyEntries ] = await Promise.all([
            Gopass.show(secretName),
            Gopass.history(secretName)
        ])
        const isPassword = passwordSecretRegex.test(secretName)

        this.setState({
            secretValue,
            historyEntries,
            isPassword,
            passwordRating: isPassword ? ratePassword(secretValue) : undefined
        })
    }

    async componentDidMount() {
        await this.createState(this.props.secretName)
    }

    async componentWillReceiveProps(props: { secretName: string }) {
        await this.createState(props.secretName)
    }
}
