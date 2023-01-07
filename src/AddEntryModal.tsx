import { Button, Form, FormInstance, Input, InputRef, Modal } from 'antd'
import * as React from 'react'
import { Gopass } from './Gopass'

const { TextArea } = Input

export interface AddEntryModalProps {
    shown: boolean
    refreshSecrets: () => void
    closeModal: () => void
}

export const AddEntryModal = ({ shown, closeModal, refreshSecrets }: AddEntryModalProps) => {
    const formRef = React.createRef<FormInstance>()
    const [adding, setAdding] = React.useState(false)

    const addEntry = async () => {
        const { key, value } = formRef.current?.getFieldsValue()
        setAdding(true)
        await Gopass.addSecret(key, value)
        setAdding(false)

        refreshSecrets()
        closeModal()
    }

    React.useEffect(() => {
        if (shown && formRef.current) {
            formRef.current.resetFields()
        }
    }, [shown, formRef])

    return (
        <Modal
            title='Add New Entry'
            open={shown}
            destroyOnClose
            footer={[
                <Button key='cancel' htmlType='submit' onClick={closeModal}>
                    Cancel
                </Button>,
                <Button key='add-entry' type='primary' htmlType='submit' onClick={addEntry} loading={adding}>
                    Add Entry
                </Button>
            ]}
            onCancel={closeModal}
        >
            <Form labelCol={{ span: 3 }} layout='horizontal' ref={formRef} className='modal-content'>
                <Form.Item name='key' label='Key'>
                    <Input autoFocus />
                </Form.Item>
                <Form.Item name='value' label='Value'>
                    <TextArea rows={8} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
