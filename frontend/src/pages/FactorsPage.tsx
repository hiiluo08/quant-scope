import React, { useEffect, useMemo, useState } from 'react'
import { getFactors, getFactorValues, getLatestFactorValues } from '../api/queries'
import { useApi } from '../hooks/useApi'
import { AsyncState } from '../components/AsyncState'
import { DataTable, type Column } from '../components/DataTable'
import { LineSeriesChart } from '../components/charts/LineSeriesChart'
import { ResearchNotice } from '../components/ResearchNotice'
import type { FactorMetadata, FactorValue } from '../api/types'

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
    { key: 'symbol', header: 'Symbol', render: (row) => row.symbol },
    { key: 'factor_value', header: 'Current value', render: (row) => formatFactorValue(row.factor_value) },
    { key: 'factor_version', header: 'Factor version', render: (row) => row.factor_version },
    { key: 'date', header: 'As of', render: (row) => row.date },
  ]
  const seriesColumns: Column<FactorValue>[] = [
    { key: 'date', header: 'Date', render: (row) => row.date },
    { key: 'symbol', header: 'Symbol', render: (row) => row.symbol },
    { key: 'factor_value', header: 'Factor value', render: (row) => formatFactorValue(row.factor_value) },
    { key: 'factor_version', header: 'Factor version', render: (row) => row.factor_version },
    { key: 'computed_at', header: 'Computed at', render: (row) => row.computed_at },
  ]

  return (
    <div className="stack page-enter">
      <ResearchNotice message="Factors are persisted research features, not trading signals or investment advice." />
      <section className="card">
        <h1 className="card-title">Factors Explorer</h1>
        <AsyncState state={catalogState} emptyMessage="Run the factor persistence job before using this page.">
          {(catalog) => catalog.count === 0 ? (
            <div className="async-empty"><h2>No factor catalog available</h2><p>Run the factor pipeline, then retry.</p><button type="button" onClick={catalogState.retry}>Retry</button></div>
          ) : (
            <div className="controls">
              <div className="control-group">
                <label htmlFor="factor-select" className="control-label">Factor</label>
                <select id="factor-select" value={factorName} onChange={(event) => setFactorName(event.target.value)}>
                  {catalog.factors.map((factor) => <option key={factor.name} value={factor.name}>{factor.name}</option>)}
                </select>
              </div>
              <div className="control-group">
                <label htmlFor="factor-symbol-select" className="control-label">Symbol</label>
                <select id="factor-symbol-select" value={symbol} onChange={(event) => setSymbol(event.target.value)} disabled={symbols.length === 0}>
                  {symbols.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
          )}
        </AsyncState>
      </section>

      {metadata && <section className="card" aria-label="Factor metadata">
        <h2 className="card-section-title">Factor Metadata</h2>
        <div className="kv-grid">
          <span className="kv-key">Factor version</span>
          <span className="kv-value">{metadata.version}</span>
          <span className="kv-key">Warm-up periods</span>
          <span className="kv-value">{metadata.warmup_periods}</span>
          {metadata.parameters && (
            <>
              <span className="kv-key">Parameters</span>
              <span className="kv-value"><code>{Object.entries(metadata.parameters).map(([k,v]) => `${k}: ${String(v)}`).join(', ')}</code></span>
            </>
          )}
          <span className="kv-key">Rows excluded (warm-up)</span>
          <span className="kv-value">{warmupExcluded}</span>
        </div>
      </section>}

      {factorName && symbol && <AsyncState state={seriesState}>
        {(response) => <>
          <LineSeriesChart title={`${response.factor_name} — ${symbol} factor value`} data={chartRows} dataKey="factor_value" />
          <DataTable caption={`Time-series values for ${response.factor_name} — ${symbol}`} columns={seriesColumns} data={response.data} getRowKey={(row) => `${row.date}-${row.symbol}`} />
        </>}
      </AsyncState>}

      {factorName && <AsyncState state={latestState}>
        {(response) => <DataTable caption={`Latest values for ${response.factor_name}`} columns={latestColumns} data={latestRows} getRowKey={(row) => row.symbol} />}
      </AsyncState>}
    </div>
  )
}
