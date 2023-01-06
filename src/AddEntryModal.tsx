import { Button, Form, Input, Modal } from 'antd'
import { ExternalLink } from '../old-src/renderer/components/ExternalLink'
import * as React from 'react'

const { TextArea } = Input

export interface AddEntryModalProps {
    shown: boolean
    closeModal: () => void
}

export const AddEntryModal = ({ shown, closeModal }: AddEntryModalProps) => (
    <Modal
        title='Add New Entry'
        open={shown}
        footer={[
            <Button key='submit' type='primary'>
                Add Entry
            </Button>
        ]}
        onCancel={closeModal}
    >
        <Form labelCol={{ span: 3 }} layout='horizontal' onValuesChange={() => {}}>
            <Form.Item label='Key'>
                <Input />
            </Form.Item>
            <Form.Item label='Value'>
                <TextArea rows={8} />
            </Form.Item>
        </Form>
    </Modal>
)
