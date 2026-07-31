import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OverviewPage } from './OverviewPage'
import * as queries from '../api/queries'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../api/queries', () => ({
    getBacktests: vi.fn(),
    getModels: vi.fn(),
    getBacktest: vi.fn(),
    getBacktestDaily: vi.fn(),
    getModel: vi.fn(),
    getPredictions: vi.fn(),
    getLatestFactorValues: vi.fn()
}))

afterEach(() => {
    cleanup()
})

describe('CommandCenter (OverviewPage)', () => {
    it('displays loading state and then renders panels', async () => {
        vi.mocked(queries.getBacktests).mockResolvedValue({ backtests: [{ backtest_id: 'b1', strategy_name: 'Alpha' }], count: 1 } as any)
        vi.mocked(queries.getModels).mockResolvedValue({ models: [{ model_id: 'm1' }], count: 1 } as any)
        vi.mocked(queries.getBacktest).mockResolvedValue({ strategy_name: 'Alpha', metrics: { cagr: 0.15, sharpe_ratio: 1.5, max_drawdown: -0.05, average_exposure: 0.8 } } as any)
        vi.mocked(queries.getBacktestDaily).mockResolvedValue({ data: [] } as any)
        vi.mocked(queries.getModel).mockResolvedValue({} as any)
        vi.mocked(queries.getPredictions).mockResolvedValue({ data: [] } as any)
        vi.mocked(queries.getLatestFactorValues).mockResolvedValue({ data: [] } as any)

        render(
            <MemoryRouter>
                <OverviewPage />
            </MemoryRouter>
        )

        expect(screen.getByText('Syncing...')).toBeVisible()

        await waitFor(() => {
            expect(screen.getByText('All Systems Operational')).toBeVisible()
        })

        expect(screen.getByText('Latest available research data & signals')).toBeVisible()
        expect(screen.getByText('Strategy Health')).toBeVisible()
        expect(screen.getByText('Active Signals')).toBeVisible()
        expect(screen.getByText('Factor Leaders (Momentum)')).toBeVisible()
    })

    it('keeps independent decision panels available when factor data is unavailable', async () => {
        vi.mocked(queries.getBacktests).mockResolvedValue({ backtests: [{ backtest_id: 'b1', strategy_name: 'Alpha' }], count: 1 } as any)
        vi.mocked(queries.getModels).mockResolvedValue({ models: [{ model_id: 'm1' }], count: 1 } as any)
        vi.mocked(queries.getBacktest).mockResolvedValue({ strategy_name: 'Alpha', metrics: { cagr: 0.15, sharpe_ratio: 1.5, max_drawdown: -0.05, average_exposure: 0.8 } } as any)
        vi.mocked(queries.getBacktestDaily).mockResolvedValue({ data: [] } as any)
        vi.mocked(queries.getModel).mockResolvedValue({} as any)
        vi.mocked(queries.getPredictions).mockResolvedValue({ data: [] } as any)
        vi.mocked(queries.getLatestFactorValues).mockRejectedValue(new Error('Factor data is unavailable'))

        render(<MemoryRouter><OverviewPage /></MemoryRouter>)

        expect(await screen.findByText('All Systems Operational')).toBeVisible()
        expect(screen.getByText('Strategy Health')).toBeVisible()
        expect(screen.getByText('Active Signals')).toBeVisible()
        expect(screen.queryByText('System Error')).not.toBeInTheDocument()
    })
})
