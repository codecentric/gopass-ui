import * as React from 'react'
import * as m from 'react-materialize'
import { SecretState } from '../MainApplication'

const copySecretToClipboard = () => alert('Secret has been copied to your clipboard.')
const copyToClipboardAction = (
    <a key='copy-clipboard' onClick={copySecretToClipboard}>
        Copy to clipboard
    </a>
)

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
                            actions={[copyToClipboardAction]}
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