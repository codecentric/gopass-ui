import * as React from 'react'
import { Button, Space } from 'antd'
import { Gopass } from './Gopass'

export interface ListHeaderProps {
    numberOfEntries: number
    refreshSecrets: () => void
    openAddEntryModal: () => void
}

export const ListHeader = ({ numberOfEntries, openAddEntryModal, refreshSecrets }: ListHeaderProps) => {
    const [syncRunning, setSyncRunning] = React.useState(false)
    const syncStores = async () => {
        setSyncRunning(true)
        await Gopass.sync()
        setSyncRunning(false)

        refreshSecrets()
    }

    return (
        <div className='list-header'>
            <strong>{numberOfEntries} Entries</strong>
            <Space direction='horizontal'>
                <Button size='small' type='primary' onClick={openAddEntryModal}>
                    Add New Entry
                </Button>
                <Button size='small' type='primary' onClick={syncStores} loading={syncRunning}>
                    Sync
                </Button>
            </Space>
        </div>
    )
}
