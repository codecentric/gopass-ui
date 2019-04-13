import * as React from 'react'
import * as m from 'react-materialize'
import * as dateformat from 'dateformat'
import { RouteComponentProps, withRouter } from 'react-router'

import Gopass, { HistoryEntry } from '../../secrets/Gopass'
import PaginatedTable from '../../components/PaginatedTable'
import { passwordSecretRegex } from '../../secrets/deriveIconFromSecretName'
import { PasswordRater, PasswordRatingResult } from '../../password-health/PasswordRater'
import PasswordRatingComponent from '../../password-health/PasswordRatingComponent'
import LoadingScreenView from '../../components/loading-screen/LoadingScreenView'

interface SecretDetailsPageState {
    secretValue: string
    historyEntries: HistoryEntry[]
    isPassword: boolean
    passwordRating: PasswordRatingResult | undefined
    loading: boolean
    edit?: {
        newValue: string
    }
    queryDeletion: boolean
}

interface SecretDetailsPageProps extends RouteComponentProps {
    secretName: string
    isAdded?: boolean
    copySecretToClipboard?: (secretName: string) => void
}

class SecretDetailsPage extends React.Component<SecretDetailsPageProps, SecretDetailsPageState> {
    constructor(props: SecretDetailsPageProps) {
        super(props)
        this.state = {
            secretValue: '',
            historyEntries: [],
            passwordRating: undefined,
            isPassword: false,
            loading: true,
            edit: undefined,
            queryDeletion: false
        }
    }

    public async componentDidMount() {
        await this.createState(this.props.secretName)
    }

    public async componentWillReceiveProps(props: SecretDetailsPageProps) {
        await this.createState(props.secretName)
    }

    public render() {
        const { secretName, isAdded } = this.props
        const { secretValue, isPassword, passwordRating, loading, edit, queryDeletion } = this.state

        const cardActions = [
            <a key='copy-clipboard' className='link' onClick={() => this.props.copySecretToClipboard!(secretName)}>Copy to clipboard</a>,
            !!edit ? (
                <span key='edit-secret-mode-actions'>
                    <a className='link' onClick={() => this.discardEditedSecretValue()}>Discard</a>
                    <a className='link' onClick={() => this.saveEditedSecretValue()}>Save changes</a>
                </span>
            ) : (
                <span key='view-secret-mode-actions'>
                    <a className='link' onClick={() => this.editSecret()}>Edit</a>
                    {
                        queryDeletion ? <>
                            <a className='link' onClick={() => this.denySecretDeletion()}>NO, keep it!</a>
                            <a className='link' onClick={() => this.confirmSecretDeletion()}>Sure!</a>
                        </> : <a className='link' onClick={() => this.querySecretDeletion()}>Delete</a>
                    }
                </span>
            )
        ]

        return (
            loading ?
                <LoadingScreenView/> :
                (
                    <>
                        <h4>Secret {isAdded && <m.Icon small>fiber_new</m.Icon>}</h4>
                        <m.Card
                            title={secretName}
                            actions={cardActions}
                        >
                            <input
                                style={{ color: '#212121' }}
                                value={edit ? edit.newValue : secretValue}
                                disabled={!edit}
                                onChange={this.onEditedValueChange}
                                ref={input => input && input.focus()}
                            />
                        </m.Card>

                        {isPassword && passwordRating && <>
                            <h4 className='m-top'>Password Strength</h4>
                            <PasswordRatingComponent passwordRating={passwordRating}/>
                        </>
                        }

                        <h4 className='m-top'>History</h4>
                        {this.renderHistoryTable()}
                    </>
                )
        )
    }

    private editSecret = () => this.setState({ edit: { newValue: this.state.secretValue } })
    private querySecretDeletion = () => this.setState({ queryDeletion: true })
    private confirmSecretDeletion = async () => {
        await Gopass.deleteSecret(this.props.secretName)
        this.props.history.replace('/')
    }
    private denySecretDeletion = () => this.setState({ queryDeletion: false })
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
                columns={columns}
                rows={rows}
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

// TODO
// const mapDispatchToProps = (dispatch: Dispatch): any => ({
//     copySecretToClipboard: (secretName: string) => {
//         Gopass.copy(secretName)
//             .then(() => {
//                 dispatch(showNotification({ status: 'OK', message: 'Secret has been copied to your clipboard.' }))
//             })
//             .catch(() => {
//                 dispatch(showNotification({ status: 'ERROR', message: 'Oops, something went wrong. Please try again.' }))
//             })
//
//     }
// })

export default withRouter(SecretDetailsPage)
