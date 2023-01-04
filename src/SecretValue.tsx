import Gopass from './Gopass'
import React, { useEffect } from 'react'

export interface SecretValueProps {
    secretKey: string
}

export const SecretValue = ({ secretKey }: SecretValueProps) => {
    const [secretValue, setSecretValue] = React.useState('...')
    useEffect(() => {
        Gopass.show(secretKey).then(setSecretValue)
    }, [secretKey])

    return <pre className='secret-value'>{secretValue}</pre>
}
