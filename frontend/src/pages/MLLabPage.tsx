import React, { useEffect, useState } from 'react'
import { getModel, getModels, getPredictions } from '../api/queries'
import { useApi } from '../hooks/useApi'
import { AsyncState } from '../components/AsyncState'
import { DataTable, type Column } from '../components/DataTable'
import { ResearchNotice } from '../components/ResearchNotice'
import { Panel } from '../components/ui/Panel'
import { Metric } from '../components/ui/Metric'
import { DataFreshness } from '../components/ui/DataFreshness'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { DetailsDrawer } from '../components/ui/DetailsDrawer'
import type { ModelManifest, PredictionRow, PredictionSplit } from '../api/types'
import { formatDate, formatFactorName } from '../lib/formatters'

const formatMetric = (value: number | null | undefined) => (
  value === null || value === undefined || !Number.isFinite(value)
    ? '—'
    : value.toFixed(4)
)

export const MLLabPage: React.FC = () => {
  const modelsState = useApi('models', getModels)
  const [modelId, setModelId] = useState('')
  const [split, setSplit] = useState<PredictionSplit>('test')

  useEffect(() => {
    if (modelsState.status === 'success' && modelsState.data.count > 0 && !modelId) {
      setModelId(modelsState.data.models[0].model_id)
    }
  }, [modelsState, modelId])

  const manifestState = useApi(
    `model-${modelId}`,
    (signal) => modelId
      ? getModel(modelId, signal)
      : Promise.reject('No model selected'),
  )
  const predictionsState = useApi(
    `predictions-${modelId}-${split}`,
    (signal) => modelId
      ? getPredictions(modelId, split, signal)
      : Promise.reject('No model selected'),
  )

  const columns: Column<PredictionRow>[] = [
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date), sortValue: (row) => row.date },
    { key: 'symbol', header: 'Symbol', render: (row) => <span style={{ fontWeight: 600 }}>{row.symbol}</span>, sortValue: row => row.symbol },
    { key: 'prediction', header: 'Prediction', render: (row) => formatMetric(row.prediction), align: 'end', sortValue: row => row.prediction },
    { key: 'forward_return_5d', header: 'Forward return (5d)', render: (row) => formatMetric(row.forward_return_5d), align: 'end', sortValue: row => row.forward_return_5d },
  ]

  const latestDate = predictionsState.status === 'success' && predictionsState.data.data.length > 0
    ? predictionsState.data.data.reduce((max, p) => p.date > max ? p.date : max, predictionsState.data.data[0].date)
    : undefined

  return (
    <div className="stack page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>
      <ResearchNotice message="ML Lab is research-only: validation/test metrics and predictions are not proven alpha, trading recommendations or a promise of profitability." />
      
      <Panel title="ML Lab">
        <AsyncState state={modelsState} emptyMessage="Run the model training pipeline before using this page." variant="panel">
          {(models) => models.count === 0 ? (
            <div className="async-empty">
              <h2>No persisted model manifest</h2>
              <p>Run the model artifact job, then retry.</p>
              <button type="button" onClick={modelsState.retry} className="btn btn-outline">Retry</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '250px' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    Latest Model
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}>
                    <span style={{ fontWeight: 600 }}>{String(models.models[0]?.family || '').toUpperCase()}</span>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
                      (Updated: {models.models[0]?.split_dates?.test_end})
                    </span>
                  </div>
                </div>
                <div style={{ minWidth: '200px' }}>
                  <SegmentedControl
                    label="Prediction split"
                    options={['validation', 'test']}
                    value={split}
                    onChange={(val) => setSplit(val as PredictionSplit)}
                  />
                </div>
              </div>
            </div>
          )}
        </AsyncState>
      </Panel>

      {modelId && (
        <AsyncState state={manifestState} variant="panel">
          {(manifest: ModelManifest) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Panel title={`Model: ${String(manifest.family || '').toUpperCase()}`}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <Metric label="Spearman IC" value={formatMetric(manifest.metrics[split]?.spearman_ic)} />
                  <Metric label="RMSE" value={formatMetric(manifest.metrics[split]?.rmse)} />
                  <Metric label="Hit Rate" value={manifest.metrics[split]?.hit_rate !== undefined ? `${(manifest.metrics[split].hit_rate! * 100).toFixed(1)}%` : '—'} />
                  <Metric label="Coverage" value={manifest.metrics[split]?.coverage !== undefined ? `${(manifest.metrics[split].coverage! * 100).toFixed(1)}%` : '—'} />
                </div>

                <DetailsDrawer title="Model Metadata & Parameters">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', fontSize: '0.875rem' }}>
                    <div><div style={{ color: 'var(--text-secondary)' }}>Model file</div><div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{manifest.model_file}</div></div>
                    <div><div style={{ color: 'var(--text-secondary)' }}>Family</div><div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{manifest.family}</div></div>
                    <div><div style={{ color: 'var(--text-secondary)' }}>Label</div><div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{manifest.label.name} · {manifest.label.horizon_days}d horizon</div></div>
                    <div><div style={{ color: 'var(--text-secondary)' }}>Features</div><div style={{ fontWeight: 500, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{manifest.feature_columns.map(formatFactorName).join(', ')}</div></div>
                    <div><div style={{ color: 'var(--text-secondary)' }}>Factor versions</div><div style={{ fontWeight: 500, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{Object.entries(manifest.factor_versions).map(([k,v]) => `${formatFactorName(k)}: ${v}`).join(', ')}</div></div>
                    <div><div style={{ color: 'var(--text-secondary)' }}>Split dates</div><div style={{ fontWeight: 500, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{Object.entries(manifest.split_dates).map(([k,v]) => `${k}: ${v}`).join(', ')}</div></div>
                    <div><div style={{ color: 'var(--text-secondary)' }}>Parameters</div><div style={{ fontWeight: 500, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{Object.entries(manifest.parameters).map(([k,v]) => `${k}: ${String(v)}`).join(', ')}</div></div>
                  </div>
                </DetailsDrawer>
              </Panel>
            </div>
          )}
        </AsyncState>
      )}

      {modelId && (
        <AsyncState state={predictionsState} variant="panel">
          {(response) => (
            <Panel title={`Predictions for ${String(response.model_id || '').substring(0,8)} — ${response.split}`} action={latestDate && <DataFreshness timestamp={latestDate} />}>
              <DataTable
                caption=""
                columns={columns}
                data={response.data}
                getRowKey={(row) => `${row.date}-${row.symbol}`}
                pageSize={20}
                initialSortKey="date"
                initialSortAsc={false}
              />
            </Panel>
          )}
        </AsyncState>
      )}
    </div>
  )
}
