import * as React from 'react'
import * as m from 'react-materialize'
import { paginationCalculator} from 'pagination-calculator'
import { PageInformation } from 'pagination-calculator/dist/paginationCalculator'

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
            pageSize: 7 // TODO: make configurable through settings page
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

        return (
            <>
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

                { this.renderPagination(pagination) }
            </>
        )
    }

    private renderPagination(pagination: PageInformation) {
        return (
            <m.Pagination
                items={ pagination.pageCount }
                activePage={ pagination.current }
                maxButtons={ pagination.pageCount <= 8 ? pagination.pageCount : 8 }
                onSelect={ this.changeToPage(pagination.pageCount) }
            />
        )
    }

    private changeToPage = (maxPageNumber: number) => {
        return (page: number) => {
            if (page <= maxPageNumber && page >= 1) {
                this.setState({ ...this.state, page })
            }
        }
    }
}
