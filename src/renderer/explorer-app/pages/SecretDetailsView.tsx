import * as React from 'react'
import * as m from 'react-materialize'
import * as dateformat from 'dateformat'

import Gopass, { HistoryEntry } from '../../secrets/Gopass'
import PaginatedTable from '../../components/PaginatedTable'
import { passwordSecretRegex } from '../../secrets/deriveIconFromSecretName'
import { PasswordRater, PasswordRatingResult } from '../../password-health/PasswordRater'
import PasswordRatingComponent from '../../password-health/PasswordRatingComponent'
import LoadingScreenView from '../../components/loading-screen/LoadingScreenView'

interface SecretDetailsState {
    secretValue: string
    historyEntries: HistoryEntry[]
    isPassword: boolean
    passwordRating: PasswordRatingResult | undefined
    loading: boolean
    edit?: {
        newValue: string
    }
}

interface SecretDetailsViewProps {
    secretName: string
    freshlyAdded?: boolean
    copySecretToClipboard?: (secretName: string) => void
}

export default class SecretDetailsView extends React.Component<SecretDetailsViewProps, SecretDetailsState> {
    constructor(props: SecretDetailsViewProps) {
        super(props)
        this.state = {
            secretValue: '',
            historyEntries: [],
            passwordRating: undefined,
            isPassword: false,
            loading: true,
            edit: undefined
        }
    }

    public async componentDidMount() {
        await this.createState(this.props.secretName)
    }

    public async componentWillReceiveProps(props: SecretDetailsViewProps) {
        await this.createState(props.secretName)
    }

    public render() {
        const { secretName, freshlyAdded } = this.props
        const { secretValue, isPassword, passwordRating, loading, edit } = this.state
        const cardActions = [
            <a key='copy-clipboard' className='link' onClick={ () => this.props.copySecretToClipboard!(secretName) }>Copy to clipboard</a>,
            !!edit ? (
                <span key='edit-secret-mode-actions'>
                    <a key='discard-changes' className='link' onClick={ () => this.discardEditedSecretValue() }>Discard</a>
                    <a key='save-secret' className='link' onClick={ () => this.saveEditedSecretValue() }>Save changes</a>
                </span>
            ) : (
                <a key='edit-secret' className='link' onClick={ () => this.editSecret() }>Edit</a>
            )
        ]

        return (
            loading ?
                <LoadingScreenView /> :
                (
                    <>
                        <h4>Secret { freshlyAdded && <m.Icon small>fiber_new</m.Icon> }</h4>
                        <m.Card
                            title={ secretName }
                            actions={ cardActions }
                        >
                            <input
                                style={{color: '#212121'}}
                                value={ edit ? edit.newValue : secretValue }
                                disabled={ !edit }
                                onChange={ this.onEditedValueChange }
                                ref={input => input && input.focus()}
                            />
                        </m.Card>

                        { isPassword && passwordRating && <>
                                <h4 className='m-top'>Password Strength</h4>
                                <PasswordRatingComponent passwordRating={ passwordRating } />
                            </>
                        }

                        <h4 className='m-top'>History</h4>
                        { this.renderHistoryTable() }
                    </>
                )
        )
    }

    private editSecret = () => this.setState({ edit: { newValue: this.state.secretValue } })
    private onEditedValueChange = (event: any) => this.setState({ edit: { newValue: event.target.value } })
    private discardEditedSecretValue = () => this.setState({ edit: undefined })

    private saveEditedSecretValue = async () => {
        const newValueToSave = this.state.edit!.newValue
        const { secretName } = this.props

        if (newValueToSave !== this.state.secretValue) {
            await Gopass.editSecret(secretName, newValueToSave)
        }

        this.setState({
            secretValue: newValueToSave,
            edit: undefined
        })
    }

    private renderHistoryTable() {
        const rows = this.state.historyEntries.map(entry => ({
            ...entry,
            id: entry.hash,
            timestamp: dateformat(new Date(entry.timestamp), 'yyyy-mm-dd HH:MM')
        }))
        const columns = [
            { fieldName: 'timestamp', label: 'Time' },
            { fieldName: 'author', label: 'Author' },
            { fieldName: 'message', label: 'Message' }
        ]

        return (
            <PaginatedTable
                columns={ columns }
                rows={ rows }
            />
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
            passwordRating: isPassword ? PasswordRater.ratePassword(secretValue) : undefined,
            loading: false
        })
    }
}
