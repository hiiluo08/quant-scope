import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { DataTable } from './DataTable'

afterEach(() => {
    cleanup()
})

describe('DataTable', () => {
    it('supports sorting, filtering, and pagination', async () => {
        const user = userEvent.setup()
        const columns = [
            { key: 'symbol', header: 'Symbol', render: (r: any) => r.symbol, sortValue: (r: any) => r.symbol },
            { key: 'prediction', header: 'Prediction', render: (r: any) => r.prediction, sortValue: (r: any) => r.prediction }
        ]
        const data = [
            { symbol: 'AAPL', prediction: 0.03 },
            { symbol: 'MSFT', prediction: 0.05 },
            { symbol: 'TSLA', prediction: -0.02 }
        ]
        render(<DataTable caption="Signals" columns={columns} data={data} getRowKey={(row) => row.symbol} pageSize={2} filterLabel="Filter signals" filterText={(row) => row.symbol} />)
        
        await user.click(screen.getByRole('button', { name: 'Prediction' }))
        expect(within(screen.getAllByRole('row')[1]).getByText('MSFT')).toBeVisible()
        
        await user.type(screen.getByRole('searchbox', { name: 'Filter signals' }), 'AAPL')
        expect(screen.queryByText('MSFT')).not.toBeInTheDocument()
    })

    it('sorts a sortable column from the keyboard', async () => {
        const user = userEvent.setup()
        const columns = [
            { key: 'symbol', header: 'Symbol', render: (r: any) => r.symbol, sortValue: (r: any) => r.symbol },
        ]
        const data = [{ symbol: 'MSFT' }, { symbol: 'AAPL' }]
        render(<DataTable caption="Signals" columns={columns} data={data} getRowKey={(row) => row.symbol} />)

        await user.tab()
        expect(screen.getByRole('button', { name: 'Symbol' })).toHaveFocus()
        await user.keyboard('{Enter}')
        expect(within(screen.getAllByRole('row')[1]).getByText('MSFT')).toBeVisible()
    })
})
