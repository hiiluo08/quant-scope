import React, { useEffect, useMemo, useState } from 'react'
import { getFactors, getFactorValues, getLatestFactorValues } from '../api/queries'
import { useApi } from '../hooks/useApi'
import { AsyncState } from '../components/AsyncState'
import { DataTable, type Column } from '../components/DataTable'
import { LineSeriesChart } from '../components/charts/LineSeriesChart'
import { ResearchNotice } from '../components/ResearchNotice'
import { Panel } from '../components/ui/Panel'
import { DetailsDrawer } from '../components/ui/DetailsDrawer'
import { DataFreshness } from '../components/ui/DataFreshness'
import type { FactorMetadata, FactorValue } from '../api/types'
import { formatDate } from '../lib/formatters'

const formatFactorValue = (value: number | null) =>
  value === null || !Number.isFinite(value) ? 'N/A' : value.toFixed(6)

export const FactorsPage: React.FC = () => {
  const catalogState = useApi('factors', getFactors)
  const [factorName, setFactorName] = useState('')
  const [symbol, setSymbol] = useState('')

  useEffect(() => {
    if (catalogState.status !== 'success' || catalogState.data.count === 0) return
    if (!factorName) {
      const preferred = catalogState.data.factors.find((factor) => factor.name === 'momentum_20d')
      setFactorName((preferred ?? catalogState.data.factors[0]).name)
    }
  }, [catalogState, factorName])

  const metadata: FactorMetadata | undefined = catalogState.status === 'success'
    ? catalogState.data.factors.find((factor) => factor.name === factorName)
    : undefined

  const latestState = useApi(
    factorName ? `factor-latest-${factorName}` : '',
    (signal) => factorName ? getLatestFactorValues(factorName, signal) : Promise.reject('No factor selected'),
  )

  const [symbols, setSymbols] = useState<string[]>([])

  useEffect(() => {
    if (latestState.status !== 'success') return
    const availableSymbols = latestState.data.data.map((row) => row.symbol)
    setSymbols(availableSymbols)
    if (availableSymbols.length === 0) {
      setSymbol('')
      return
    }
    if (!symbol || !availableSymbols.includes(symbol)) {
      setSymbol(availableSymbols.includes('SPY') ? 'SPY' : availableSymbols[0])
    }
  }, [latestState, symbol])

  const seriesState = useApi(
    factorName && symbol ? `factor-series-${factorName}-${symbol}` : '',
    (signal) => factorName && symbol
      ? getFactorValues(factorName, symbol, signal)
      : Promise.reject('No factor symbol selected'),
  )

  const chartRows = useMemo(() => seriesState.status === 'success'
    ? seriesState.data.data.filter((row): row is FactorValue => row.factor_value !== null && Number.isFinite(row.factor_value))
    : [], [seriesState])
  const latestRows = latestState.status === 'success'
    ? [...latestState.data.data].sort((a, b) => a.symbol.localeCompare(b.symbol))
    : []
  const warmupExcluded = seriesState.status === 'success'
    ? seriesState.data.data.length - chartRows.length
    : 0

  const latestColumns: Column<FactorValue>[] = [
    { key: 'symbol', header: 'Symbol', render: (row) => <span style={{ fontWeight: 600 }}>{row.symbol}</span>, sortValue: (row) => row.symbol },
    { key: 'factor_value', header: 'Current value', render: (row) => formatFactorValue(row.factor_value), align: 'end', sortValue: (row) => row.factor_value ?? -Infinity },
    { key: 'factor_version', header: 'Factor version', render: (row) => row.factor_version },
  ]

  const seriesColumns: Column<FactorValue>[] = [
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date), sortValue: (row) => row.date },
    { key: 'symbol', header: 'Symbol', render: (row) => row.symbol },
    { key: 'factor_value', header: 'Factor value', render: (row) => formatFactorValue(row.factor_value), align: 'end' },
    { key: 'factor_version', header: 'Factor version', render: (row) => row.factor_version },
    { key: 'computed_at', header: 'Computed at', render: (row) => formatDate(row.computed_at) },
  ]

  const latestDate = latestRows.length > 0 ? latestRows[0].date : undefined

  return (
    <div className="stack page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>
      <ResearchNotice message="Factors are persisted research features, not trading signals or investment advice." />
      
      <Panel title="Factors Explorer">
        <AsyncState state={catalogState} emptyMessage="Run the factor persistence job before using this page." variant="panel">
          {(catalog) => catalog.count === 0 ? (
            <div className="async-empty"><h2>No factor catalog available</h2><p>Run the factor pipeline, then retry.</p><button type="button" onClick={catalogState.retry}>Retry</button></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '200px' }}>
                  <label htmlFor="factor-select" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Factor</label>
                  <select 
                    id="factor-select" 
                    value={factorName} 
                    onChange={(event) => setFactorName(event.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
                  >
                    {catalog.factors.map((factor) => <option key={factor.name} value={factor.name}>{factor.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '200px' }}>
                  <label htmlFor="factor-symbol-select" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Symbol</label>
                  <select 
                    id="factor-symbol-select" 
                    value={symbol} 
                    onChange={(event) => setSymbol(event.target.value)} 
                    disabled={symbols.length === 0}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
                  >
                    {symbols.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
              </div>

              {metadata && (
                <DetailsDrawer title="Factor Metadata">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.875rem' }}>
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Factor version</div>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{metadata.version}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Warm-up periods</div>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{metadata.warmup_periods}</div>
                    </div>
                    {metadata.parameters && (
                      <div>
                        <div style={{ color: 'var(--text-secondary)' }}>Parameters</div>
                        <div style={{ fontWeight: 500, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                          {Object.entries(metadata.parameters).map(([k,v]) => `${k}: ${String(v)}`).join(', ')}
                        </div>
                      </div>
                    )}
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Rows excluded (warm-up)</div>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{warmupExcluded}</div>
                    </div>
                  </div>
                </DetailsDrawer>
              )}
            </div>
          )}
        </AsyncState>
      </Panel>

      {factorName && symbol && <AsyncState state={seriesState} variant="panel">
        {(response) => (
          <Panel title={`${response.factor_name} — ${symbol} factor value`}>
            <div style={{ height: '300px', marginBottom: '24px' }}>
              <LineSeriesChart title="" data={chartRows} dataKey="factor_value" />
            </div>
            <DataTable caption={`Time-series values for ${response.factor_name} — ${symbol}`} columns={seriesColumns} data={response.data} getRowKey={(row) => `${row.date}-${row.symbol}`} pageSize={10} initialSortKey="date" initialSortAsc={false} />
          </Panel>
        )}
      </AsyncState>}

      {factorName && <AsyncState state={latestState} variant="panel">
        {(response) => (
          <Panel title={`Latest values for ${response.factor_name}`} action={latestDate && <DataFreshness timestamp={latestDate} />}>
            <DataTable caption="" columns={latestColumns} data={latestRows} getRowKey={(row) => row.symbol} pageSize={10} />
          </Panel>
        )}
      </AsyncState>}
    </div>
  )
}
