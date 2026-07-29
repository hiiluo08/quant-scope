import React, { useEffect, useState } from 'react'
import { getModel, getModels, getPredictions } from '../api/queries'
import { useApi } from '../hooks/useApi'
import { AsyncState } from '../components/AsyncState'
import { DataTable, type Column } from '../components/DataTable'
import { ResearchNotice } from '../components/ResearchNotice'
import type { ModelManifest, PredictionRow, PredictionSplit } from '../api/types'

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
    { key: 'date', header: 'Date', render: (row) => row.date },
    { key: 'symbol', header: 'Symbol', render: (row) => row.symbol },
    { key: 'prediction', header: 'Prediction', render: (row) => formatMetric(row.prediction) },
    { key: 'forward_return_5d', header: 'Forward return (5d)', render: (row) => formatMetric(row.forward_return_5d) },
  ]

  return (
    <div className="stack page-enter">
      <ResearchNotice message="ML Lab is research-only: validation/test metrics and predictions are not proven alpha, trading recommendations or a promise of profitability." />
      <section className="card">
        <h1 className="card-title">ML Lab</h1>
        <AsyncState state={modelsState} emptyMessage="Run the model training pipeline before using this page.">
          {(models) => models.count === 0 ? (
            <div className="async-empty">
              <h2>No persisted model manifest</h2>
              <p>Run the model artifact job, then retry.</p>
              <button type="button" onClick={modelsState.retry}>Retry</button>
            </div>
          ) : (
            <div className="controls">
              <div className="control-group">
                <label htmlFor="model-select" className="control-label">Model</label>
                <select
                  id="model-select"
                  value={modelId}
                  onChange={(event) => setModelId(event.target.value)}
                >
                  {models.models.map((model) => (
                    <option key={model.model_id} value={model.model_id}>
                      {model.model_id} — {model.family}
                    </option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label htmlFor="split-select" className="control-label">Prediction split</label>
                <select
                  id="split-select"
                  value={split}
                  onChange={(event) => setSplit(event.target.value as PredictionSplit)}
                >
                  <option value="test">test</option>
                  <option value="validation">validation</option>
                </select>
              </div>
            </div>
          )}
        </AsyncState>
      </section>

      {modelId && (
        <AsyncState state={manifestState}>
          {(manifest: ModelManifest) => (
            <section className="card stack-sm">
              <h2 className="card-title">{manifest.family} · {manifest.model_id}</h2>
              
              <div className="kv-grid">
                <span className="kv-key">Model file</span>
                <span className="kv-value">{manifest.model_file}</span>
                <span className="kv-key">Family</span>
                <span className="kv-value">{manifest.family}</span>
                <span className="kv-key">Label</span>
                <span className="kv-value">{manifest.label.name} · {manifest.label.horizon_days}d horizon</span>
                <span className="kv-key">Features</span>
                <span className="kv-value"><code>{manifest.feature_columns.join(', ')}</code></span>
                <span className="kv-key">Factor versions</span>
                <span className="kv-value"><code>{Object.entries(manifest.factor_versions).map(([k,v]) => `${k}: ${v}`).join(', ')}</code></span>
                <span className="kv-key">Split dates</span>
                <span className="kv-value"><code>{Object.entries(manifest.split_dates).map(([k,v]) => `${k}: ${v}`).join(', ')}</code></span>
                <span className="kv-key">Parameters</span>
                <span className="kv-value"><code>{Object.entries(manifest.parameters).map(([k,v]) => `${k}: ${String(v)}`).join(', ')}</code></span>
              </div>

              <div className="comparison-grid">
                <section className="comparison-column">
                  <h3 className="comparison-column-title">Validation metrics</h3>
                  <div className="kv-grid">
                    {Object.entries(manifest.metrics.validation).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <span className="kv-key">{key}</span>
                        <span className="kv-value">{formatMetric(value)}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </section>
                <section className="comparison-column">
                  <h3 className="comparison-column-title">Held-out test metrics</h3>
                  <div className="kv-grid">
                    {Object.entries(manifest.metrics.test).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <span className="kv-key">{key}</span>
                        <span className="kv-value">{formatMetric(value)}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          )}
        </AsyncState>
      )}

      {modelId && (
        <AsyncState state={predictionsState}>
          {(response) => (
            <div className="card">
              <DataTable
                caption={`Predictions for ${response.model_id} — ${response.split}`}
                columns={columns}
                data={response.data}
                getRowKey={(row) => `${row.date}-${row.symbol}`}
              />
            </div>
          )}
        </AsyncState>
      )}
    </div>
  )
}
