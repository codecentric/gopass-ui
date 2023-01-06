import { Button, Form, FormInstance, Input, Modal } from 'antd'
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
        if (shown) {
            formRef.current?.setFieldsValue({ key: '', value: '' })
        }
    }, [shown])

    return (
        <Modal
            title='Add New Entry'
            open={shown}
            footer={[
                <Button key='submit' type='primary' htmlType='submit' onClick={addEntry} loading={adding}>
                    Add Entry
                </Button>
            ]}
            onCancel={closeModal}
        >
            <Form labelCol={{ span: 3 }} layout='horizontal' ref={formRef}>
                <Form.Item name='key' label='Key'>
                    <Input />
                </Form.Item>
                <Form.Item name='value' label='Value'>
                    <TextArea rows={8} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
