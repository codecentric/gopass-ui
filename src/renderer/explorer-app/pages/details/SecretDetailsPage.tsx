import * as React from 'react'
import * as m from 'react-materialize'
import { withRouter, RouteComponentProps } from 'react-router'

import Gopass, { HistoryEntry } from '../../../secrets/Gopass'
import { passwordSecretRegex } from '../../../secrets/deriveIconFromSecretName'
import { PasswordRater, PasswordRatingResult } from '../../../password-health/PasswordRater'
import PasswordRatingComponent from '../../../password-health/PasswordRatingComponent'
import { LoadingScreen } from '../../../components/loading-screen/LoadingScreen'
import { useCopySecretToClipboard } from '../../../hooks/useCopySecretToClipboard'
import { HistoryTable } from './HistoryTable'

interface SecretDetailsPageProps extends RouteComponentProps {
    secretName: string
    isAdded?: boolean
}

function SecretDetailsPage({ secretName, isAdded, history }: SecretDetailsPageProps) {
    const [ secretValue, setSecretValue ] = React.useState('')
    const [ historyEntries, setHistoryEntries ] = React.useState<HistoryEntry[]>([])
    const [ passwordRating, setPasswordRating ] = React.useState<PasswordRatingResult | undefined>()
    const [ isPassword, setIsPassword ] = React.useState(false)
    const [ loading, setLoading ] = React.useState(true)
    const [ editedSecretValue, setEditedSecretValue ] = React.useState()
    const [ queryDeletion, setQueryDeletion ] = React.useState(false)

    React.useEffect(() => {
        Promise.all([
            Gopass.show(secretName),
            Gopass.history(secretName)
        ]).then(([ newSecretValue, newHistoryEntries ]) => {
            setIsPassword(passwordSecretRegex.test(secretName))
            setSecretValue(newSecretValue)
            setHistoryEntries(newHistoryEntries)
            setLoading(false)
        })
    }, [ secretName ])

    React.useEffect(() => {
        setPasswordRating(isPassword ? PasswordRater.ratePassword(secretValue) : undefined)
    }, [ isPassword ])

    const querySecretDeletion = () => setQueryDeletion(true)
    const denySecretDeletion = () => setQueryDeletion(false)
    const confirmSecretDeletion = () => Gopass.deleteSecret(secretName).then(() => history.replace('/'))
    const deletionModeButtons = queryDeletion ? <>
        <a className='link' onClick={() => denySecretDeletion}>NO, keep it!</a>
        <a className='link' onClick={() => confirmSecretDeletion}>Sure!</a>
    </> : <a className='link' onClick={() => querySecretDeletion}>Delete</a>

    const querySecretEditing = () => setEditedSecretValue(secretValue)
    const discardSecretEditing = () => setEditedSecretValue(undefined)
    const onNewSecretValueChange = (event: any) => setEditedSecretValue(event.target.value)
    const saveEditedSecretValue = async () => {
        if (editedSecretValue !== secretValue) {
            await Gopass.editSecret(secretName, editedSecretValue).then()
        }

        setSecretValue(editedSecretValue)
        setEditedSecretValue(undefined)
    }
    const editModeButtons = <>
        <a className='link' onClick={() => discardSecretEditing}>Discard</a>
        <a className='link' onClick={() => saveEditedSecretValue}>Save changes</a>
    </>

    const inEditMode = editedSecretValue !== undefined
    const copySecretToClipboard = useCopySecretToClipboard()
    const cardActions = [
        <a key='copy-clipboard' className='link' onClick={() => copySecretToClipboard(secretName)}>Copy to clipboard</a>,
        inEditMode ? <span key='edit-secret-mode-actions'>{ editModeButtons }</span> :
            <span key='view-secret-mode-actions'><a className='link' onClick={() => querySecretEditing}>Edit</a>{deletionModeButtons}</span>
    ]

    return loading ? <LoadingScreen/> : <>
        <h4>Secret {isAdded && <m.Icon small>fiber_new</m.Icon>}</h4>
        <m.Card title={secretName} actions={cardActions}>
            <input
                style={{ color: '#212121' }}
                value={inEditMode ? editedSecretValue : secretValue}
                disabled={!inEditMode}
                onChange={onNewSecretValueChange}
                ref={input => input && input.focus()}
            />
        </m.Card>

        {isPassword && passwordRating && <>
            <h4 className='m-top'>Password Strength</h4>
            <PasswordRatingComponent passwordRating={passwordRating}/>
        </>
        }

        <h4 className='m-top'>History</h4>
        <HistoryTable entries={historyEntries}/>
    </>
}

export default withRouter(SecretDetailsPage)
