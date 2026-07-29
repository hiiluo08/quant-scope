import React, { useEffect, useState } from 'react'
import { getBacktest, getBacktestDaily, getBacktests } from '../api/queries'
import { useApi } from '../hooks/useApi'
import { AsyncState } from '../components/AsyncState'
import { DataTable, type Column } from '../components/DataTable'
import { MetricCard } from '../components/MetricCard'
import { EquityChart } from '../components/charts/EquityChart'
import { DrawdownChart } from '../components/charts/DrawdownChart'
import { ResearchNotice } from '../components/ResearchNotice'
import { formatNumber, formatPercent } from './formatters'
import { toDrawdown } from './backtestTransforms'
import type { BacktestMetadata, DailyBacktestRow } from '../api/types'

export const BacktestsPage: React.FC = () => {
  const listState = useApi('backtests', getBacktests)
  const [backtestId, setBacktestId] = useState('')

  useEffect(() => {
    if (listState.status === 'success' && listState.data.count > 0 && !backtestId) {
      setBacktestId(listState.data.backtests[0].backtest_id)
    }
  }, [listState, backtestId])

  const metadataState = useApi(
    `backtest-${backtestId}`,
    (signal) => backtestId
      ? getBacktest(backtestId, signal)
      : Promise.reject('No backtest selected'),
  )
  const dailyState = useApi(
    `backtest-daily-${backtestId}`,
    (signal) => backtestId
      ? getBacktestDaily(backtestId, signal)
      : Promise.reject('No backtest selected'),
  )

  const columns: Column<DailyBacktestRow>[] = [
    { key: 'date', header: 'Date', render: (row) => row.date },
    { key: 'gross_return', header: 'Gross return', render: (row) => formatPercent(row.gross_return) },
    { key: 'net_return', header: 'Net return', render: (row) => formatPercent(row.net_return) },
    { key: 'turnover', header: 'Turnover', render: (row) => formatNumber(row.turnover, 4) },
    { key: 'transaction_cost', header: 'Transaction cost', render: (row) => formatNumber(row.transaction_cost, 6) },
    { key: 'portfolio_exposure', header: 'Exposure', render: (row) => formatNumber(row.portfolio_exposure, 4) },
    { key: 'equity_curve', header: 'Equity curve', render: (row) => formatNumber(row.equity_curve, 4) },
  ]

  return (
    <div className="backtests-page">
      <ResearchNotice message="Timing: signal at t, position/PnL at t+1. This artifact models 5 bps transaction cost and 5 bps slippage; historical research is not a guarantee or investment advice." />
      <section className="card">
        <h1 className="card-title">Backtest Results</h1>
        <AsyncState state={listState} emptyMessage="Run the backtest persistence job before using this page.">
          {(list) => list.count === 0 ? (
            <div className="async-empty">
              <h2>No persisted backtest artifact</h2>
              <p>Run the matching pipeline job, then retry.</p>
              <button type="button" onClick={listState.retry}>Retry</button>
            </div>
          ) : (
            <>
              <label htmlFor="backtest-select">Backtest artifact</label>
              <select
                id="backtest-select"
                value={backtestId}
                onChange={(event) => setBacktestId(event.target.value)}
              >
                {list.backtests.map((item) => (
                  <option key={item.backtest_id} value={item.backtest_id}>
                    {item.strategy_name} — {item.backtest_id}
                  </option>
                ))}
              </select>
            </>
          )}
        </AsyncState>
      </section>

      {backtestId && (
        <AsyncState state={metadataState}>
          {(metadata: BacktestMetadata) => (
            <section className="card">
              <h2>{metadata.strategy_name}</h2>
              <p>Engine {metadata.engine_version} · {metadata.start_date} to {metadata.end_date}</p>
              <p>Factor versions: {JSON.stringify(metadata.factor_versions)}</p>
              <div className="metric-grid">
                {[
                  ['Total return', metadata.metrics.total_return, formatPercent],
                  ['CAGR', metadata.metrics.cagr, formatPercent],
                  ['Annualized volatility', metadata.metrics.annualized_volatility, formatPercent],
                  ['Sharpe ratio', metadata.metrics.sharpe_ratio, formatNumber],
                  ['Max drawdown', metadata.metrics.max_drawdown, formatPercent],
                  ['Average turnover', metadata.metrics.average_turnover, formatNumber],
                  ['Average exposure', metadata.metrics.average_exposure, formatNumber],
                  ['Calmar ratio', metadata.metrics.calmar_ratio, formatNumber],
                  ['Win rate', metadata.metrics.win_rate, formatPercent],
                  ['Trading days', metadata.metrics.trading_days, formatNumber],
                ].map(([label, value, formatter]) => (
                  <MetricCard
                    key={String(label)}
                    label={String(label)}
                    value={(formatter as (input: number | null) => string)(value as number | null)}
                  />
                ))}
              </div>
            </section>
          )}
        </AsyncState>
      )}

      {backtestId && (
        <AsyncState state={dailyState} emptyMessage="No daily rows are persisted for this backtest.">
          {(response) => response.count === 0 || response.data.length === 0 ? (
            <div className="async-empty">
              <h2>No daily backtest rows</h2>
              <p>Verify the artifact contains daily_results.parquet.</p>
              <button type="button" onClick={dailyState.retry}>Retry</button>
            </div>
          ) : (
            <>
              <EquityChart data={response.data} />
              <DrawdownChart data={toDrawdown(response.data)} />
              <DataTable
                caption="Daily backtest results"
                columns={columns}
                data={response.data}
                getRowKey={(row) => row.date}
              />
            </>
          )}
        </AsyncState>
      )}
    </div>
  )
}