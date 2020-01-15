import * as React from 'react'
import * as m from 'react-materialize'
import { RouteComponentProps, withRouter } from 'react-router'

import Gopass, { HistoryEntry } from '../../../secrets/Gopass'
import { passwordSecretRegex } from '../../../secrets/deriveIconFromSecretName'
import { LoadingScreen } from '../../../components/loading-screen/LoadingScreen'
import { useCopySecretToClipboard } from '../../../secrets/useCopySecretToClipboard'
import { HistoryTable } from './HistoryTable'
import PasswordRatingComponent from '../../password-health/PasswordRatingComponent'

interface SecretDetailsPageProps extends RouteComponentProps {
    secretName: string
    isAdded?: boolean
    onSecretDelete: () => void
}

function SecretDetailsPage({ secretName, isAdded, history, onSecretDelete }: SecretDetailsPageProps) {
    const [ secretValue, setSecretValue ] = React.useState('')
    const [ historyEntries, setHistoryEntries ] = React.useState<HistoryEntry[]>([])
    const [ loading, setLoading ] = React.useState(true)
    const [ isPassword, setIsPassword ] = React.useState(false)
    const [ editedSecretValue, setEditedSecretValue ] = React.useState()
    const [ queryDeletion, setQueryDeletion ] = React.useState(false)

    React.useEffect(() => {
        setLoading(true)

        Promise.all([
            Gopass.show(secretName),
            Gopass.history(secretName)
        ]).then(([ newSecretValue, newHistoryEntries ]) => {
            setSecretValue(newSecretValue)
            setHistoryEntries(newHistoryEntries)
            setLoading(false)
        })
    }, [ secretName ])

    React.useEffect(() => {
        setIsPassword(passwordSecretRegex.test(secretName))
    }, [ secretValue ])

    const querySecretDeletion = () => setQueryDeletion(true)
    const denySecretDeletion = () => setQueryDeletion(false)
    const confirmSecretDeletion = () => Gopass.deleteSecret(secretName).then(() => history.replace('/'))
    const deletionModeButtons = queryDeletion ? <>
        <a className='link' onClick={denySecretDeletion}>NO, keep it!</a>
        <a className='link'
            onClick={async () => {
                await confirmSecretDeletion()
                onSecretDelete()
            }}>Sure!</a>
    </> : <a className='link' onClick={querySecretDeletion}>Delete</a>

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
        <a className='link' onClick={discardSecretEditing}>Discard</a>
        <a className='link' onClick={saveEditedSecretValue}>Save changes</a>
    </>

    const inEditMode = editedSecretValue !== undefined
    const copySecretToClipboard = useCopySecretToClipboard()
    const cardActions = [
        <a key='copy-clipboard' className='link' onClick={() => copySecretToClipboard(secretName)}>Copy to clipboard</a>,
        inEditMode ? <span key='edit-secret-mode-actions'>{ editModeButtons }</span> :
            <span key='view-secret-mode-actions'><a className='link' onClick={querySecretEditing}>Edit</a>{deletionModeButtons}</span>
    ]
    const valueToDisplay = inEditMode ? editedSecretValue : secretValue
    const linesRequired = valueToDisplay.split('\n').length

    return loading ? <><h4>Secret {isAdded && <m.Icon small>fiber_new</m.Icon>}</h4><LoadingScreen/></> : <>
        <h4>Secret {isAdded && <m.Icon small>fiber_new</m.Icon>}</h4>
        <m.Card title={secretName} actions={cardActions}>
            <textarea
                style={{
                    color: '#212121',
                    fontSize: 16,
                    borderBottom: '1px dotted rgba(0, 0, 0, 0.42)',
                    height: 21 * linesRequired,
                    borderTop: 'none',
                    borderRight: 'none',
                    borderLeft: 'none'
                }}
                value={valueToDisplay}
                disabled={!inEditMode}
                onChange={onNewSecretValueChange}
                ref={input => input && input.focus()}
             />
        </m.Card>

        {isPassword && <>
            <h4 className='m-top'>Password Strength</h4>
            <PasswordRatingComponent secretValue={secretValue}/>
        </>}

        <h4 className='m-top'>History</h4>
        <HistoryTable entries={historyEntries}/>
    </>
}

export default withRouter(SecretDetailsPage)
