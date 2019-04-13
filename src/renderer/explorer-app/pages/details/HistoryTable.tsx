import * as React from 'react'
import * as dateformat from 'dateformat'

import PaginatedTable from '../../../components/PaginatedTable'
import { HistoryEntry } from '../../../secrets/Gopass'

export interface HistoryTableProps {
    entries: HistoryEntry[]
}

export function HistoryTable({ entries }: HistoryTableProps) {
    const rows = entries.map(entry => ({
        ...entry,
        id: entry.hash,
        timestamp: dateformat(new Date(entry.timestamp), 'yyyy-mm-dd HH:MM')
    }))
    const columns = [
        { fieldName: 'timestamp', label: 'Time' },
        { fieldName: 'author', label: 'Author' },
        { fieldName: 'message', label: 'Message' }
    ]

    return (
        <PaginatedTable
            columns={ columns }
            rows={ rows }
        />
    )
}
