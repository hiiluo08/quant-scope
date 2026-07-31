import React, { useState, useMemo } from 'react'

export interface Column<T> {
    key: string
    header: string
    render: (row: T) => React.ReactNode
    sortValue?: (row: T) => string | number
    align?: 'start' | 'end'
}

export interface DataTableProps<T> {
    caption: string
    columns: Column<T>[]
    data: T[]
    getRowKey: (row: T) => string | number
    pageSize?: number
    filterLabel?: string
    filterText?: (row: T) => string
    initialSortKey?: string
    initialSortAsc?: boolean
}

export function DataTable<T>({ caption, columns, data, getRowKey, pageSize, filterLabel, filterText, initialSortKey, initialSortAsc = false }: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(initialSortKey || null)
    const [sortAsc, setSortAsc] = useState(initialSortAsc)
    const [filter, setFilter] = useState('')
    const [page, setPage] = useState(0)

    const filteredData = useMemo(() => {
        if (!filter || !filterText) return data
        const query = filter.toLowerCase()
        return data.filter(row => filterText(row).toLowerCase().includes(query))
    }, [data, filter, filterText])

    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData
        const col = columns.find(c => c.key === sortKey)
        if (!col || !col.sortValue) return filteredData
        
        return [...filteredData].sort((a, b) => {
            const vA = col.sortValue!(a)
            const vB = col.sortValue!(b)
            if (vA < vB) return sortAsc ? -1 : 1
            if (vA > vB) return sortAsc ? 1 : -1
            return 0
        })
    }, [filteredData, sortKey, sortAsc, columns])

    const pagedData = useMemo(() => {
        if (!pageSize) return sortedData
        const start = page * pageSize
        return sortedData.slice(start, start + pageSize)
    }, [sortedData, pageSize, page])

    const totalPages = pageSize ? Math.ceil(sortedData.length / pageSize) : 1

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortAsc(!sortAsc)
        } else {
            setSortKey(key)
            setSortAsc(false)
        }
    }

    return (
        <div className="table-wrapper">
            {filterLabel && filterText && (
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="search"
                        aria-label={filterLabel}
                        placeholder={filterLabel}
                        value={filter}
                        onChange={e => {
                            setFilter(e.target.value)
                            setPage(0)
                        }}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
                    />
                </div>
            )}
            <table className="data-table">
                <caption style={{ textAlign: 'left', fontWeight: 600, padding: '8px 16px', color: 'var(--text-primary)' }}>
                    {caption}
                </caption>
                <thead>
                    <tr>
                        {columns.map((col) => {
                            const isSortable = !!col.sortValue
                            const sortAttr = sortKey === col.key ? (sortAsc ? 'ascending' : 'descending') : 'none'
                            return (
                                <th
                                    key={col.key}
                                    scope="col"
                                    aria-sort={isSortable ? sortAttr : undefined}
                                    style={{ textAlign: col.align || 'start' }}
                                >
                                    {isSortable ? (
                                        <button
                                            type="button"
                                            onClick={() => handleSort(col.key)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                                color: 'inherit', font: 'inherit', display: 'flex', alignItems: 'center', gap: '4px',
                                                width: '100%', justifyContent: col.align === 'end' ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            {col.header}
                                            {sortKey === col.key && (
                                                <span aria-hidden="true">{sortAsc ? '▲' : '▼'}</span>
                                            )}
                                        </button>
                                    ) : (
                                        col.header
                                    )}
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {pagedData.map((row) => (
                    <tr key={getRowKey(row)}>
                        {columns.map((col) => (
                            <td key={col.key} style={{ textAlign: col.align || 'start' }}>
                                {col.render(row)}
                            </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </table>
            {pageSize !== undefined && totalPages > 1 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center', padding: '0 16px' }}>
                    <button 
                        type="button" 
                        onClick={() => setPage(p => Math.max(0, p - 1))} 
                        disabled={page === 0}
                        aria-label="Previous page"
                        className="btn btn-outline"
                        style={{ padding: '4px 12px', fontSize: '0.875rem' }}
                    >
                        Previous
                    </button>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Page {page + 1} of {totalPages}</span>
                    <button 
                        type="button" 
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
                        disabled={page === totalPages - 1}
                        aria-label="Next page"
                        className="btn btn-outline"
                        style={{ padding: '4px 12px', fontSize: '0.875rem' }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}