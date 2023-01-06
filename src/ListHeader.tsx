import { PlusCircleTwoTone } from '@ant-design/icons'
import * as React from 'react'
import { Button } from 'antd'

export interface ListHeaderProps {
    numberOfEntries: number
    openAddEntryModal: () => void
}

export const ListHeader = ({ numberOfEntries, openAddEntryModal }: ListHeaderProps) => {
    return (
        <div className='list-header'>
            <strong>{numberOfEntries} Entries</strong>
            <Button size='small' type='primary' onClick={openAddEntryModal}>
                Add New Entry
            </Button>
        </div>
    )
}
