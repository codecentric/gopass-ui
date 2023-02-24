import { Gopass } from './Gopass'
import React, { useEffect } from 'react'
import { sleep } from './util/sleep'
import { Spin } from 'antd'

export interface SecretValueProps {
    secretKey: string
}

export const SecretValue = ({ secretKey }: SecretValueProps) => {
    const [secretValue, setSecretValue] = React.useState<undefined | string>(undefined)
    useEffect(() => {
        ;(async () => {
            const [value] = await Promise.all([Gopass.show(secretKey), sleep(200)])

            setSecretValue(value)
        })()
    }, [secretKey])

    return secretValue === undefined ? <Spin /> : <pre className='secret-value'>{secretValue}</pre>
}
