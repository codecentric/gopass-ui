import * as React from 'react'
import * as m from 'react-materialize'
import { timeout } from 'promise-timeout'
import { shell } from 'electron'

import Gopass from '../../secrets/Gopass'
import { ExternalLink } from '../../components/ExternalLink'
import { Settings } from '../../common/Settings'

type ErrorDetails = 'GOPASS_CONNECTION' | 'DECRYPTION' | undefined

export function EnvironmentTest() {
    const [ environmentTestStatus, setEnvironmentTestStatus ] = React.useState<'PENDING' | 'RUNNING' | 'OK' | 'ERROR'>('PENDING')
    const [ errorDetails, setErrorDetails ] = React.useState<ErrorDetails>()

    function reset() {
        setEnvironmentTestStatus('PENDING')
        setErrorDetails(undefined)
    }

    function executeTest() {
        setEnvironmentTestStatus('RUNNING')

        timeout(Gopass.getAllSecretNames(), 1500).then(([ firstEntry ]) => {
            if (firstEntry) {
                timeout(Gopass.show(firstEntry), 10000).then(() => {
                    setEnvironmentTestStatus('OK')
                    Settings.setSystemSettings({ environmentTestSuccessful: true })
                }).catch(() => {
                    setEnvironmentTestStatus('ERROR')
                    Settings.setSystemSettings({ environmentTestSuccessful: false })
                    setErrorDetails('DECRYPTION')
                })
            }
        }).catch(() => {
            setEnvironmentTestStatus('ERROR')
            Settings.setSystemSettings({ environmentTestSuccessful: false })
            setErrorDetails('GOPASS_CONNECTION')
        })
    }

    switch (environmentTestStatus) {
        case 'PENDING':
            return <PendingContent executeTest={executeTest}/>
        case 'RUNNING':
            return <RunningContent/>
        case 'OK':
            return <OkContent/>
        default:
        case 'ERROR':
            return <ErrorContent errorDetails={errorDetails} reset={reset}/>
    }
}

function PendingContent(props: { executeTest: () => void }) {
    return (
        <>
            Your system has to meet the following requirements for Gopass UI to work properly:
            <ol>
                <li>Gopass needs to be installed and configured to be up and running 🙂</li>
                <li>MacOS: you should use <span className='code'>pinentry-mac</span> as a GPG passphrase dialog tool
                    (available <ExternalLink url='https://formulae.brew.sh/formula/pinentry-mac'>as Brew
                        formulae</ExternalLink>)
                </li>
            </ol>
            <p>During the environment test you might be asked for your GPG passphrase. Please unlock your GPG keypair by
                entering it.</p>
            <m.Button onClick={props.executeTest} waves='light'>Test your environment</m.Button>
        </>
    )
}

function RunningContent() {
    return (
        <div style={{ textAlign: 'center' }}>
            <m.Preloader size='small'/>
            <br/>
            <br/>
            <strong>Tests are running...</strong>
        </div>
    )
}

function ErrorContent(props: { errorDetails: ErrorDetails, reset: () => void }) {
    return <div style={{ textAlign: 'center' }}>
        <m.Icon large>error</m.Icon>
        <br/>
        <h4>Oops, something went wrong.</h4>
        {
            props.errorDetails && <>
                <strong>
                    {props.errorDetails === 'DECRYPTION' && <>It wasn't possible to decrypt your secrets.</>}
                    {props.errorDetails === 'GOPASS_CONNECTION' && <>It wasn't possible to access the gopass CLI.</>}
                </strong><br/>
                <br/>
            </>
        }
        Do you need help getting started? <a onClick={() => shell.openExternal('https://github.com/codecentric/gopass-ui/issues')}>Please
        create an issue.</a><br/>
        <br/>
        <m.Button onClick={props.reset} waves='light'>restart</m.Button>
    </div>
}

function OkContent() {
    return <div style={{ textAlign: 'center' }}>
        <m.Icon large>done</m.Icon>
        <br/>
        <strong>Everything looks fine</strong>
    </div>
}
