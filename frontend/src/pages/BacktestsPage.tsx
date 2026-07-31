import React, { useEffect, useState } from 'react'
import { getBacktest, getBacktestDaily, getBacktests } from '../api/queries'
import { useApi } from '../hooks/useApi'
import { AsyncState } from '../components/AsyncState'
import { DataTable, type Column } from '../components/DataTable'
import { Metric } from '../components/ui/Metric'
import { EquityChart } from '../components/charts/EquityChart'
import { DrawdownChart } from '../components/charts/DrawdownChart'
import { ResearchNotice } from '../components/ResearchNotice'
import { Panel } from '../components/ui/Panel'
import { DetailsDrawer } from '../components/ui/DetailsDrawer'
import { formatNumber, formatPercent } from './formatters'
import { formatDate } from '../lib/formatters'
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
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date), sortValue: (row) => row.date },
    { key: 'gross_return', header: 'Gross return', render: (row) => formatPercent(row.gross_return), align: 'end' },
    { key: 'net_return', header: 'Net return', render: (row) => formatPercent(row.net_return), align: 'end' },
    { key: 'turnover', header: 'Turnover', render: (row) => formatNumber(row.turnover, 4), align: 'end' },
    { key: 'transaction_cost', header: 'Tx cost', render: (row) => formatNumber(row.transaction_cost, 6), align: 'end' },
    { key: 'portfolio_exposure', header: 'Exposure', render: (row) => formatNumber(row.portfolio_exposure, 4), align: 'end' },
    { key: 'equity_curve', header: 'Equity curve', render: (row) => formatNumber(row.equity_curve, 4), align: 'end' },
  ]

  return (
    <div className="stack page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>
      <ResearchNotice message="Timing: signal at t, position/PnL at t+1. This artifact models 5 bps transaction cost and 5 bps slippage; historical research is not a guarantee or investment advice." />
      
      <Panel title="Backtest Results">
        <AsyncState state={listState} emptyMessage="Run the backtest persistence job before using this page." variant="panel">
          {(list) => list.count === 0 ? (
            <div className="async-empty">
              <h2>No persisted backtest artifact</h2>
              <p>Run the matching pipeline job, then retry.</p>
              <button type="button" onClick={listState.retry} className="btn btn-outline">Retry</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="backtest-select" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Backtest artifact</label>
              <select
                id="backtest-select"
                value={backtestId}
                onChange={(event) => setBacktestId(event.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--surface-1)', color: 'var(--text-primary)', maxWidth: '400px' }}
              >
                {list.backtests.map((item) => (
                  <option key={item.backtest_id} value={item.backtest_id}>
                    {item.strategy_name} — {item.backtest_id}
                  </option>
                ))}
              </select>
            </div>
          )}
        </AsyncState>
      </Panel>

      {backtestId && (
        <AsyncState state={metadataState} variant="panel">
          {(metadata: BacktestMetadata) => (
            <Panel title={metadata.strategy_name}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <Metric label="Total return" value={formatPercent(metadata.metrics.total_return)} tone={metadata.metrics.total_return && metadata.metrics.total_return > 0 ? 'positive' : 'negative'} />
                <Metric label="CAGR" value={formatPercent(metadata.metrics.cagr)} tone={metadata.metrics.cagr && metadata.metrics.cagr > 0 ? 'positive' : 'negative'} />
                <Metric label="Volatility" value={formatPercent(metadata.metrics.annualized_volatility)} />
                <Metric label="Sharpe" value={formatNumber(metadata.metrics.sharpe_ratio)} tone={metadata.metrics.sharpe_ratio && metadata.metrics.sharpe_ratio > 1 ? 'positive' : 'negative'} />
                <Metric label="Max DD" value={formatPercent(metadata.metrics.max_drawdown)} tone="negative" />
                <Metric label="Turnover" value={formatNumber(metadata.metrics.average_turnover)} />
                <Metric label="Exposure" value={formatNumber(metadata.metrics.average_exposure)} />
                <Metric label="Calmar" value={formatNumber(metadata.metrics.calmar_ratio)} />
                <Metric label="Win rate" value={formatPercent(metadata.metrics.win_rate)} />
                <Metric label="Trading days" value={formatNumber(metadata.metrics.trading_days)} />
              </div>
              <DetailsDrawer title="Backtest Metadata">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.875rem' }}>
                  <div><div style={{ color: 'var(--text-secondary)' }}>Engine version</div><div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{metadata.engine_version}</div></div>
                  <div><div style={{ color: 'var(--text-secondary)' }}>Period</div><div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{metadata.start_date} to {metadata.end_date}</div></div>
                  <div><div style={{ color: 'var(--text-secondary)' }}>Factor versions</div><div style={{ fontWeight: 500, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{Object.entries(metadata.factor_versions).map(([k,v]) => `${k}: ${v}`).join(', ')}</div></div>
                </div>
              </DetailsDrawer>
            </Panel>
          )}
        </AsyncState>
      )}

      {backtestId && (
        <AsyncState state={dailyState} emptyMessage="No daily rows are persisted for this backtest." variant="panel">
          {(response) => response.count === 0 || response.data.length === 0 ? (
            <Panel>
              <div className="async-empty">
                <h2>No daily backtest rows</h2>
                <p>Verify the artifact contains daily_results.parquet.</p>
                <button type="button" onClick={dailyState.retry} className="btn btn-outline">Retry</button>
              </div>
            </Panel>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                <div style={{ height: '300px' }}>
                  <EquityChart data={response.data} />
                </div>
                <div style={{ height: '300px' }}>
                  <DrawdownChart data={toDrawdown(response.data)} />
                </div>
              </div>
              
              <Panel>
                <DataTable
                  caption="Daily backtest results"
                  columns={columns}
                  data={response.data}
                  getRowKey={(row) => row.date}
                  pageSize={20}
                  initialSortKey="date"
                  initialSortAsc={false}
                />
              </Panel>
            </div>
          )}
        </AsyncState>
      )}
    </div>
  )
}