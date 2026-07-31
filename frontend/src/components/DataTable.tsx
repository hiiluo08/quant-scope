import React from 'react'

export interface Column<T> {
    key: string
    header: string
    render: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
    caption: string
    columns: Column<T>[]
    data: T[]
    getRowKey: (row: T) => string | number
}

export function DataTable<T>({ caption, columns, data, getRowKey }: DataTableProps<T>) {
    return (
        <div className="table-wrapper">
            <table className="data-table">
                <caption>
                    {caption}
                </caption>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} scope="col">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                    <tr key={getRowKey(row)}>
                        {columns.map((col) => (
                            <td key={col.key}>
                                {col.render(row)}
                            </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}