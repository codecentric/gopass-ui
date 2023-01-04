import { Button, Input, Space } from 'antd'
import * as React from 'react'
import { useEffect } from 'react'
import Gopass from './Gopass'

export interface EditSecretProps {
    secretKey: string
    close: (secretKey: string) => void
}

export const EditSecret = ({ secretKey, close }: EditSecretProps) => {
    const [secretValue, setSecretValue] = React.useState('...')
    useEffect(() => {
        Gopass.show(secretKey).then(setSecretValue)
    }, [secretKey])
    const closeEditMode = React.useCallback(() => {
        close(secretKey)
    }, [secretKey])

    return (
        <Space direction='horizontal'>
            <Input size='small' value={secretValue} />
            <Button size='small' type='primary' onClick={closeEditMode}>
                Save
            </Button>
            <Button size='small' onClick={closeEditMode}>
                Discard Changes
            </Button>
        </Space>
    )
}
