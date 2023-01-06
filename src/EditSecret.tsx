import { Button, Input, Space, Spin } from 'antd'
import * as React from 'react'
import { useEffect } from 'react'
import { Gopass } from './Gopass'
import { sleep } from './util/sleep'

export interface EditSecretProps {
    secretKey: string
    close: (secretKey: string) => void
}

export const EditSecret = ({ secretKey, close }: EditSecretProps) => {
    const [secretValue, setSecretValue] = React.useState<undefined | string>(undefined)
    useEffect(() => {
        ;(async () => {
            const [value] = await Promise.all([Gopass.show(secretKey), sleep(200)])

            setSecretValue(value)
        })()
    }, [secretKey])
    const closeEditMode = React.useCallback(() => {
        close(secretKey)
    }, [secretKey])

    return (
        <Space direction='vertical'>
            {secretValue === undefined ? (
                <Spin size='large' />
            ) : (
                <>
                    <Input size='small' value={secretValue} />
                    <Space direction='horizontal'>
                        <Button size='small' type='primary' onClick={closeEditMode}>
                            Save
                        </Button>
                        <Button size='small' onClick={closeEditMode}>
                            Discard Changes
                        </Button>
                    </Space>
                </>
            )}
        </Space>
    )
}
