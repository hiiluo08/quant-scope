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
        <div className="table-container" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <caption style={{ textAlign: 'left', fontWeight: 'bold', paddingBottom: '0.5rem' }}>
                    {caption}
                </caption>
                <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                        {columns.map((col) => (
                            <th key={col.key} scope="col" style={{ padding: '8px 12px' }}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                    <tr key={getRowKey(row)} style={{ borderBottom: '1px solid var(--border)'}}>
                        {columns.map((col) => (
                            <td key={col.key} style={{ padding: '8px 12px' }}>
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