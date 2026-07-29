import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MarketDataPage } from './MarketDataPage'
import * as queries from '../api/queries'

vi.mock('../api/queries', () => ({
    getSymbols: vi.fn(),
    getMarketData: vi.fn(),
}))

describe('MarketDataPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders loading state initially', () => {
        vi.mocked(queries.getSymbols).mockReturnValue(new Promise(() => {}))
        render(<MarketDataPage />)
        expect(screen.getByRole('status')).toHaveTextContent(/loading research data/i)
    })

    it('renders symbol dropdown and chart titles on success', async () => {
        vi.mocked(queries.getSymbols).mockResolvedValue({ symbols: ['SPY', 'AAPL'], count: 2 })
        vi.mocked(queries.getMarketData).mockResolvedValue({
            symbol: 'SPY',
            count: 1,
            data: [{ date: '2026-01-01', open: 100, high: 105, low: 99, close: 104, adjusted_close: 104, volume: 1000000 }],
        })

        render(<MarketDataPage />)

        await waitFor(() => {
            expect(screen.getByLabelText('Symbol')).toBeInTheDocument()
            expect(screen.getByText(/SPY — Adjusted Close Price/i)).toBeInTheDocument()
            expect(screen.getByText(/SPY — Trading Volume/i)).toBeInTheDocument()
            expect(screen.getByText(/Recent 100 sessions for SPY/i)).toBeInTheDocument()
        })
    })

    it('renders error state and handles retry', async () => {
        vi.mocked(queries.getSymbols).mockRejectedValue(new Error('Network error'))
        render(<MarketDataPage />)

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument()
        })
        expect(screen.getByText(/Network error/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })
})