import * as React from 'react'
import * as m from 'react-materialize'
import { timeout } from 'promise-timeout'
import { shell } from 'electron'

import Gopass from '../../../secrets/Gopass'
import Settings from '../../../Settings'

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
        case 'ERROR':
            return <ErrorContent errorDetails={errorDetails} reset={reset}/>
    }
}

function PendingContent(props: { executeTest: () => void }) {
    return <>
        You have to meet the following requirements to use our application:
        <ul>
            <li>* sure, you need gopass up and running 🙂</li>
            <li>* MAC: you should use the <span className="code">pinentry-mac</span> tool to enter your passphrase</li>
        </ul>
        <m.Button onClick={props.executeTest} waves='light'>Test your environment</m.Button>
    </>
}

function RunningContent() {
    return <div style={{ textAlign: 'center' }}>
        <m.Preloader size='small'/>
        <br/>
        <br/>
        <strong>The tests are running...</strong>
    </div>
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
                    {props.errorDetails === 'GOPASS_CONNECTION' && <>It wasn't possible to access the gopass cli.</>}
                </strong><br/>
                <br/>
            </>
        }
        Do you need help? <a onClick={() => shell.openExternal('https://github.com/codecentric/gopass-ui/issues')}>Please create an issue.</a><br/>
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
