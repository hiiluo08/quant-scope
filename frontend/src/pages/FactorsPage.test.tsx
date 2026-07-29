import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FactorsPage } from './FactorsPage'
import { ApiError } from '../api/client'
import { getFactors, getFactorValues, getLatestFactorValues } from '../api/queries'

vi.mock('../api/queries', () => ({
    getFactors: vi.fn(),
    getFactorValues: vi.fn(),
    getLatestFactorValues: vi.fn(),
}))

const catalog = {
    factors: [
        { name: 'momentum_20d', version: 'v1', warmup_periods: 20, parameters: { window: 20 } },
        { name: 'volatility_20d', version: 'v1', warmup_periods: 20 }
    ],
    count: 2
}

const latest = {
    factor_name: 'momentum_20d', factor_version: 'v1', count: 2,
    data: [
        { date: '2025-01-03', symbol: 'AAPL', factor_name: 'momentum_20d', factor_value: 0.12, factor_version: 'v1', computed_at: '2025-01-04T00:00:00Z' },
        { date: '2025-01-03', symbol: 'SPY', factor_name: 'momentum_20d', factor_value: -0.03, factor_version: 'v1', computed_at: '2025-01-04T00:00:00Z' },
    ],
    }
    const series = {
    factor_name: 'momentum_20d', factor_version: 'v1', count: 2,
    data: [
        { date: '2025-01-02', symbol: 'SPY', factor_name: 'momentum_20d', factor_value: null, factor_version: 'v1', computed_at: '2025-01-03T00:00:00Z' },
        { date: '2025-01-03', symbol: 'SPY', factor_name: 'momentum_20d', factor_value: -0.04, factor_version: 'v1', computed_at: '2025-01-04T00:00:00Z' },
    ],
}

beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getFactors).mockResolvedValue(catalog)
    vi.mocked(getFactorValues).mockResolvedValue(series)
    vi.mocked(getLatestFactorValues).mockResolvedValue(latest)
})

describe('FactorsPage', () => {
    it('shows loading then controls, metadata, chart and latest table', async () => {
        render(<FactorsPage />)
        expect(screen.getByRole('status')).toBeInTheDocument()
        expect(await screen.findByLabelText('Factor')).toHaveValue('momentum_20d')
        expect(screen.getByLabelText('Symbol')).toBeInTheDocument()
        expect(await screen.findByText('Factor version')).toBeInTheDocument()
        expect(screen.getAllByText('v1').length).toBeGreaterThan(0)
        expect(screen.getByText('Warm-up periods')).toBeInTheDocument()
        expect(screen.getAllByText('20').length).toBeGreaterThan(0)
        expect(await screen.findByRole('heading', { name: /momentum_20d.*SPY.*factor/i })).toBeInTheDocument()
        expect(screen.getByText('Latest values for momentum_20d')).toBeInTheDocument()
        expect(screen.getByText('0.120000')).toBeInTheDocument()
    })

    it('shows catalog error and retries the catalog request', async () => {
        vi.mocked(getFactors).mockRejectedValueOnce(new Error('catalog unavailable'))
        render(<FactorsPage />)
        expect(await screen.findByRole('alert')).toHaveTextContent('catalog unavailable')
        fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
        await waitFor(() => expect(getFactors).toHaveBeenCalledTimes(2))
    })

    it('requests the new factor and symbol after selector changes', async () => {
        render(<FactorsPage />)
        await screen.findByLabelText('Factor')
        fireEvent.change(screen.getByLabelText('Factor'), { target: { value: 'volatility_20d' } })
        fireEvent.change(screen.getByLabelText('Symbol'), { target: { value: 'AAPL' } })
        await waitFor(() => expect(getFactorValues).toHaveBeenCalledWith('volatility_20d', 'AAPL', expect.any(AbortSignal)))
        expect(getLatestFactorValues).toHaveBeenCalledWith('volatility_20d', expect.any(AbortSignal))
    })

    it('shows a series 404 as an error with Retry, not a fabricated empty envelope', async () => {
        vi.mocked(getFactorValues).mockRejectedValueOnce(new ApiError(404, 'No factor values match the requested filters'))
        render(<FactorsPage />)
        expect(await screen.findByRole('alert')).toHaveTextContent('No factor values match')
        expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    })
})