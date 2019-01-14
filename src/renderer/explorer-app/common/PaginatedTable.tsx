import * as React from 'react'
import * as m from 'react-materialize'
import { paginationCalculator } from 'pagination-calculator'
import './PaginatedTable.css'

export interface TableColumn {
    fieldName: string
    label: string
}

export interface TableRow {
    id: string
    [fieldName: string]: string
}

export interface PaginatedTableProps {
    columns: TableColumn[]
    rows: TableRow[]
}
export interface PaginatedTableState {
    page: number
    pageSize: number
}

export default class PaginatedTable extends React.Component<PaginatedTableProps, PaginatedTableState> {
    constructor(props: any) {
        super(props)
        this.state = {
            page: 1,
            pageSize: 10 // TODO: make configurable through settings page
        }
    }

    public render() {
        const { columns, rows } = this.props
        const pagination = paginationCalculator({
            total: rows.length,
            current: this.state.page,
            pageSize: this.state.pageSize,
            pageLimit: Math.ceil(rows.length / this.state.pageSize)
        })
        const pageRows = rows.slice(pagination.showingStart - 1, pagination.showingEnd)
        const paginationMarkup = this.renderPagination(pagination)

        return (
            <>
                { paginationMarkup }

                <m.Table>
                    <thead>
                        <tr>
                            {
                                columns.map(column => (
                                    <th key={ column.fieldName } data-field={ column.fieldName }>
                                        { column.label }
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            pageRows.map(row => (
                                <tr key={ row.id }>
                                    { columns.map(column => (<td key={ `${row.id}-${column.fieldName}` }>{ row[column.fieldName] }</td>)) }
                                </tr>
                            ))
                        }
                    </tbody>
                </m.Table>

                { paginationMarkup }
            </>
        )
    }

    private renderPagination(pagination: any) {
        return (
            <div className='pagination'>
                {
                    pagination.current > 1 ? <span onClick={ this.changeToPage(pagination.current - 1) }><m.Icon>chevron_left</m.Icon></span> : undefined
                }
                {
                    pagination.pages.map((page: number) => {
                        if (page == pagination.current) {
                            return <strong>{ page }</strong>
                        } else {
                            return <span onClick={ this.changeToPage(page as number) }>{ page }</span>
                        }
                    })
                }
                { pagination.pageCount - pagination.current > 0 ? <span onClick={ this.changeToPage(pagination.current + 1) }><m.Icon>chevron_right</m.Icon></span> : undefined }
            </div>
        )
    }

    private changeToPage = (page: number) => {
        return () => this.setState({ ...this.state, page })
    }
}
