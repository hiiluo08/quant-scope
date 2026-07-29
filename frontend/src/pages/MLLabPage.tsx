import React, { useEffect, useState } from 'react'
import { getModel, getModels, getPredictions } from '../api/queries'
import { useApi } from '../hooks/useApi'
import { AsyncState } from '../components/AsyncState'
import { DataTable, type Column } from '../components/DataTable'
import { ResearchNotice } from '../components/ResearchNotice'
import type { ModelManifest, PredictionRow, PredictionSplit } from '../api/types'

const formatMetric = (value: number | null | undefined) => (
  value === null || value === undefined || !Number.isFinite(value)
    ? 'Not available'
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
    <div className="ml-lab-page">
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
              <label htmlFor="model-select">Model</label>
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
              <label htmlFor="split-select">Prediction split</label>
              <select
                id="split-select"
                value={split}
                onChange={(event) => setSplit(event.target.value as PredictionSplit)}
              >
                <option value="test">test</option>
                <option value="validation">validation</option>
              </select>
            </div>
          )}
        </AsyncState>
      </section>

      {modelId && (
        <AsyncState state={manifestState}>
          {(manifest: ModelManifest) => (
            <section className="card" style={{ marginTop: '1rem' }}>
              <h2>{manifest.family} · {manifest.model_id}</h2>
              <p>Model file: {manifest.model_file}</p>
              <p>Label: {manifest.label.name}, horizon {manifest.label.horizon_days} days</p>
              <p>Features: {manifest.feature_columns.join(', ')}</p>
              <p>Factor versions: {JSON.stringify(manifest.factor_versions)}</p>
              <p>Split dates: {JSON.stringify(manifest.split_dates)}</p>
              <p>Parameters: {JSON.stringify(manifest.parameters)}</p>
              <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <section className="card">
                  <h3>Validation metrics</h3>
                  {Object.entries(manifest.metrics.validation).map(([key, value]) => (
                    <p key={key}>{key}: {formatMetric(value)}</p>
                  ))}
                </section>
                <section className="card">
                  <h3>Held-out test metrics</h3>
                  {Object.entries(manifest.metrics.test).map(([key, value]) => (
                    <p key={key}>{key}: {formatMetric(value)}</p>
                  ))}
                </section>
              </div>
            </section>
          )}
        </AsyncState>
      )}

      {modelId && (
        <AsyncState state={predictionsState}>
          {(response) => (
            <div className="card" style={{ marginTop: '1rem' }}>
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
