import * as React from 'react'
import * as m from 'react-materialize'
import { SecretState } from '../MainApplication'
import Gopass from '../../secrets/Gopass'

const copySecretToClipboard = (secretName: string) => async () => {
    await Gopass.copy(secretName)
    alert('Secret has been copied to your clipboard.')
}

type SecretDetailsProps = SecretState
export default class SecretDetails extends React.Component<SecretDetailsProps, any> {
    render() {
        const { secretName, secretValue } = this.props
        const secretIsChosen = secretName || secretValue

        return (
            <div>
                {
                    secretIsChosen ?
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
                        </m.Card> :
                        <m.CardPanel>
                            Please pick a secret from the navigation on the left.
                        </m.CardPanel>
                }
            </div>
        )
    }
}