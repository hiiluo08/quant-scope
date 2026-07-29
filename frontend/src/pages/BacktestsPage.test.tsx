import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BacktestsPage } from './BacktestsPage'
import { getBacktest, getBacktestDaily, getBacktests } from '../api/queries'
import { rollingMax, toDrawdown } from './backtestTransforms'

vi.mock('../api/queries', () => ({ getBacktests: vi.fn(), getBacktest: vi.fn(), getBacktestDaily: vi.fn() }))

const metadata = {
  backtest_id: 'bt-demo-001', strategy_name: 'factor_rank_baseline', engine_version: 'v1',
  start_date: '2020-01-01', end_date: '2025-01-01', factor_versions: { momentum_20d: 'v1' },
  transaction_cost_bps: 5, slippage_bps: 5, initial_equity: 1,
  selection: 'lowest validation RMSE; rank IC only breaks an exact RMSE tie', champion_model_id: 'model-demo-001',
  metrics: { total_return: 0.12, cagr: null, annualized_volatility: 0.18, sharpe_ratio: null, max_drawdown: -0.2, average_turnover: 0.04, average_exposure: 0.95, calmar_ratio: 0.6, win_rate: 0.52, trading_days: 3 },
  benchmarks: { SPY: { total_return: 0.3, sharpe_ratio: 0.9 } },
}
const metadata2 = { ...metadata, backtest_id: 'bt-demo-002' }
const daily = { backtest_id: 'bt-demo-001', count: 3, data: [
  { date: '2025-01-01', gross_return: 0.1, turnover: 0.2, transaction_cost: 0.001, net_return: 0.099, portfolio_exposure: 1, equity_curve: 1 },
  { date: '2025-01-02', gross_return: -0.1, turnover: 0.2, transaction_cost: 0.001, net_return: -0.101, portfolio_exposure: 1, equity_curve: 1.1 },
  { date: '2025-01-03', gross_return: -0.1, turnover: 0.2, transaction_cost: 0.001, net_return: -0.101, portfolio_exposure: 1, equity_curve: 0.99 },
] }

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getBacktests).mockResolvedValue({ backtests: [metadata, metadata2], count: 2 })
  vi.mocked(getBacktest).mockResolvedValue(metadata)
  vi.mocked(getBacktestDaily).mockResolvedValue(daily)
})

describe('BacktestsPage', () => {
  it('shows empty list and explains the prerequisite', async () => {
    vi.mocked(getBacktests).mockResolvedValueOnce({ backtests: [], count: 0 })
    render(<BacktestsPage />)
    expect(await screen.findByText(/No persisted backtest artifact/i)).toBeInTheDocument()
  })

  it('formats missing metrics as Not available and separates charts', async () => {
    render(<BacktestsPage />)
    expect((await screen.findAllByText('—')).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: /Net equity curve after modeled costs/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Drawdown from running peak/i })).toBeInTheDocument()
    expect(screen.queryByText('NaN')).not.toBeInTheDocument()
    expect(screen.getByText(/Daily backtest results/i)).toBeInTheDocument()
  })

  it('computes running maximum and drawdown correctly', () => {
    expect(rollingMax([1, 1.1, 0.99])).toEqual([1, 1.1, 1.1])
    expect(toDrawdown(daily.data).map((row) => row.drawdown)).toEqual([0, 0, expect.closeTo(-0.1, 6)])
  })

  it('repeats metadata and daily requests after changing artifact', async () => {
    render(<BacktestsPage />)
    await screen.findByLabelText('Backtest artifact')
    fireEvent.change(screen.getByLabelText('Backtest artifact'), { target: { value: 'bt-demo-002' } })
    await waitFor(() => expect(getBacktest).toHaveBeenCalledWith('bt-demo-002', expect.any(AbortSignal)))
    await waitFor(() => expect(getBacktestDaily).toHaveBeenCalledWith('bt-demo-002', expect.any(AbortSignal)))
  })
})