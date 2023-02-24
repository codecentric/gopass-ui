import { Button, Form, Input, Modal, Switch } from 'antd'
import { ExternalLink } from '../old-src/renderer/components/ExternalLink'
import * as React from 'react'

export interface SettingsModalProps {
    shown: boolean
    closeModal: () => void
}

export const SettingsModal = ({ shown, closeModal }: SettingsModalProps) => (
    <Modal
        title='Settings'
        open={shown}
        footer={[
            <Button key='submit' type='primary'>
                Save
            </Button>
        ]}
        onCancel={closeModal}
    >
        <Form labelCol={{ span: 6 }} layout='horizontal' onValuesChange={() => {}}>
            <Form.Item
                label='Shortcut to open'
                extra={
                    <>
                        <span>System shortcut to open the app</span>{' '}
                        <ExternalLink url='https://www.electronjs.org/docs/api/accelerator#available-modifiers'>(see all options)</ExternalLink>
                    </>
                }
            >
                <Input />
            </Form.Item>
            <Form.Item label='Start on login' valuePropName='checked'>
                <Switch />
            </Form.Item>
        </Form>
    </Modal>
)
