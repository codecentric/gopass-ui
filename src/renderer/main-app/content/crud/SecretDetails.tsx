import * as React from 'react'
import * as m from 'react-materialize'
import { SecretState } from '../../MainApplication'
import Gopass from '../../../secrets/Gopass'

const copySecretToClipboard = (secretName: string) => async () => {
    await Gopass.copy(secretName)
    alert('Secret has been copied to your clipboard.')
}

export default class SecretDetails extends React.Component<{ secretName: string }, { secretValue: string }> {
    constructor(props: any) {
        super(props)
        this.state = { secretValue: '' }
    }

    render() {
        const { secretName } = this.props
        const { secretValue } = this.state

        return (
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
            </m.Card>
        )
    }

    async componentDidMount() {
        const secretValue = await Gopass.show(this.props.secretName)
        this.setState({ secretValue })
    }
}