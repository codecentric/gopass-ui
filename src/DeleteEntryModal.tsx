import { Button, Modal, Space } from 'antd'
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
                <Button key='cancel' onClick={closeModal}>
                    Cancel
                </Button>,
                <Button key='delete-entry' type='primary' danger onClick={deleteEntry} loading={deleting}>
                    Delete Entry
                </Button>
            ]}
            onCancel={closeModal}
        >
            <Space direction='vertical' size='large' className='modal-content'>
                <p>Are you sure you want to delete this Entry?</p>
                <pre>{secretKey}</pre>
            </Space>
        </Modal>
    )
}
