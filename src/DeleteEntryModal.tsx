import { Button, Modal } from 'antd'
import * as React from 'react'
import { Gopass } from './Gopass'

export interface AddEntryModalProps {
    secretKey?: string
    refreshSecrets: () => void
    closeModal: () => void
}

export const DeleteEntryModal = ({ secretKey, closeModal, refreshSecrets }: AddEntryModalProps) => {
    const [deleting, setDeleting] = React.useState(false)

    const deleteEntry = async () => {
        setDeleting(true)
        await Gopass.deleteSecret(secretKey!)
        setDeleting(false)

        refreshSecrets()
        closeModal()
    }

    return (
        <Modal
            title='Delete Entry'
            open={!!secretKey}
            footer={[
                <Button key='submit' type='primary' danger htmlType='submit' onClick={deleteEntry} loading={deleting}>
                    Delete Entry
                </Button>
            ]}
            onCancel={closeModal}
        >
            <p>Are you sure you want to delete this Entry?</p>
            <pre>{secretKey}</pre>
        </Modal>
    )
}
