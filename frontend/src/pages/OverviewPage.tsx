import React, { useEffect, useState } from 'react'
import { Panel } from '../components/ui/Panel'
import { Metric } from '../components/ui/Metric'
import { StatusBadge } from '../components/ui/StatusBadge'
import { DataTable, type Column } from '../components/DataTable'
import { EquityChart } from '../components/charts/EquityChart'
import { AsyncState } from '../components/AsyncState'
import { getBacktests, getBacktest, getBacktestDaily, getModels, getModel, getPredictions, getLatestFactorValues } from '../api/queries'
import { deriveStrategyHealth, extractTopSignals, deriveFactorLeaders, type CommandCenterInputs, type SignalRow, type FactorLeader } from './commandCenterTransforms'

export const OverviewPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<CommandCenterInputs | null>(null)

  useEffect(() => {
    const abortController = new AbortController()
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1. Get lists to find champions
        const [backtestsRes, modelsRes] = await Promise.all([
          getBacktests(abortController.signal),
          getModels(abortController.signal)
        ])

        const championBacktestId = backtestsRes.backtests[0]?.backtest_id
        const championModelId = modelsRes.models[0]?.model_id

        let backtestPromise = Promise.resolve(undefined)
        let dailyPromise = Promise.resolve(undefined)
        if (championBacktestId) {
          backtestPromise = getBacktest(championBacktestId, abortController.signal) as any
          dailyPromise = getBacktestDaily(championBacktestId, abortController.signal).then(res => res.data) as any
        }
        
        let modelPromise = Promise.resolve(undefined)
        let predictionsPromise = Promise.resolve(undefined)
        if (championModelId) {
          modelPromise = getModel(championModelId, abortController.signal) as any
          predictionsPromise = getPredictions(championModelId, 'test', abortController.signal).then(res => res.data) as any
        }

        const factorPromise = getLatestFactorValues('momentum_1m', abortController.signal)
          .catch((factorError: unknown) => {
            if (factorError instanceof DOMException && factorError.name === 'AbortError') {
              throw factorError
            }
            return undefined
          }) as any

        const [backtest, daily, model, predictions, latestFactors] = await Promise.all([
          backtestPromise,
          dailyPromise,
          modelPromise,
          predictionsPromise,
          factorPromise
        ])

        setData({
          backtest,
          daily,
          model,
          predictions,
          latestFactors
        })
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.75rem' }}>Command Center</h1>
          <p className="page-subtitle" style={{ margin: 0, color: 'var(--text-secondary)', marginTop: '4px' }}>Latest available research data & signals</p>
        </div>
        <StatusBadge 
          tone={error ? 'negative' : loading ? 'warning' : 'positive'} 
          label={error ? 'System Error' : loading ? 'Syncing...' : 'All Systems Operational'} 
        />
      </div>

      <AsyncState state={{
        status: error ? 'error' : loading ? 'loading' : (data ? 'success' : 'empty'),
        error: error || undefined,
        data: data,
        retry: () => window.location.reload()
      } as any} variant="panel">
        {() => {
          if (!data) return null

          const health = deriveStrategyHealth(data.backtest)
          const topSignals = extractTopSignals(data.predictions)
          const factorLeaders = deriveFactorLeaders(data.latestFactors)

          const signalColumns: Column<SignalRow>[] = [
            { key: 'symbol', header: 'Symbol', render: r => <span style={{ fontWeight: 600 }}>{r.symbol}</span>, sortValue: r => r.symbol },
            { key: 'prediction', header: 'Alpha (5d)', render: r => (r.prediction * 100).toFixed(2) + '%', align: 'end', sortValue: r => r.prediction },
          ]

          const factorColumns: Column<FactorLeader>[] = [
            { key: 'symbol', header: 'Symbol', render: r => <span style={{ fontWeight: 600 }}>{r.symbol}</span>, sortValue: r => r.symbol },
            { key: 'factor_value', header: 'Value', render: r => r.factor_value.toFixed(2), align: 'end', sortValue: r => r.factor_value },
          ]

          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Strategy Health Panel */}
              <Panel title="Strategy Health" action={health ? <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{health.strategy_name}</span> : null}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <Metric label="CAGR" value={health ? (health.cagr * 100).toFixed(2) + '%' : '-'} tone={health && health.cagr > 0 ? 'positive' : 'negative'} />
                  <Metric label="Sharpe" value={health ? health.sharpe_ratio.toFixed(2) : '-'} tone={health && health.sharpe_ratio > 1 ? 'positive' : 'negative'} />
                  <Metric label="Max DD" value={health ? (health.max_drawdown * 100).toFixed(2) + '%' : '-'} tone="negative" />
                  <Metric label="Exposure" value={health ? (health.average_exposure * 100).toFixed(2) + '%' : '-'} />
                </div>
                <div style={{ height: '300px' }}>
                  {data.daily ? <EquityChart data={data.daily} /> : <div className="async-empty">No equity data</div>}
                </div>
              </Panel>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Active Signals */}
                <Panel title="Active Signals">
                  <DataTable
                    caption="Top Long Predictions"
                    columns={signalColumns}
                    data={topSignals}
                    getRowKey={r => r.symbol}
                  />
                </Panel>

                {/* Factor Leaders */}
                <Panel title="Factor Leaders (Momentum)">
                  <DataTable
                    caption="Top Momentum Stocks"
                    columns={factorColumns}
                    data={factorLeaders}
                    getRowKey={r => r.symbol}
                  />
                </Panel>
              </div>
            </div>
          )
        }}
      </AsyncState>
    </div>
  )
}
