import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MLLabPage } from './MLLabPage'
import { ApiError } from '../api/client'
import { getModel, getModels, getPredictions } from '../api/queries'

vi.mock('../api/queries', () => ({ getModels: vi.fn(), getModel: vi.fn(), getPredictions: vi.fn() }))

const manifest = {
  model_id: 'model-demo-001', model_file: 'model.json', family: 'xgboost' as const,
  feature_columns: ['momentum_20d', 'volatility_20d'], factor_versions: { momentum_20d: 'v1' },
  label: { name: 'forward_return_5d', horizon_days: 5 }, split_dates: { train_end: '2023-12-29', validation_end: '2024-12-31' },
  parameters: { n_estimators: 500, learning_rate: 0.02 },
  metrics: { validation: { rmse: 0.1, rank_ic: null }, test: { rmse: 0.12, rank_ic: 0.04 } },
}
const manifest2 = { ...manifest, model_id: 'model-demo-002' }

const predictions = { model_id: 'model-demo-001', split: 'test' as const, count: 1, data: [
  { model_id: 'model-demo-001', date: '2025-01-03', symbol: 'SPY', split: 'test' as const, prediction: 0.01, forward_return_5d: -0.02 },
] }

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getModels).mockResolvedValue({ models: [manifest, manifest2], count: 2 })
  vi.mocked(getModel).mockResolvedValue(manifest)
  vi.mocked(getPredictions).mockResolvedValue(predictions)
})

afterEach(() => {
  cleanup()
})

describe('MLLabPage', () => {
  it('shows manifest, split controls, metrics and research-only prediction table', async () => {
    render(<MLLabPage />)
    await waitFor(() => expect(screen.getByLabelText('Model')).toHaveValue('model-demo-001'))
    expect(screen.getByLabelText('Prediction split')).toHaveValue('test')
    expect(await screen.findByRole('heading', { level: 2, name: /model-demo-001/i })).toBeInTheDocument()
    expect((await screen.findAllByText(/momentum_20d/i)).length).toBeGreaterThan(0)
    expect((await screen.findAllByText('—')).length).toBeGreaterThan(0)
    expect((await screen.findAllByText('SPY')).length).toBeGreaterThan(0)
    expect(screen.getByText(/research-only/i)).toBeInTheDocument()
    expect(screen.queryByText(/buy|sell/i)).not.toBeInTheDocument()
  })

  it('handles a nested-empty model list at the page boundary', async () => {
    vi.mocked(getModels).mockResolvedValueOnce({ models: [], count: 0 })
    render(<MLLabPage />)
    expect(await screen.findByText(/No persisted model manifest/i)).toBeInTheDocument()
  })

  it('shows missing predictions as a 404 error with Retry, not an empty fixture', async () => {
    vi.mocked(getPredictions).mockRejectedValueOnce(new ApiError(404, 'Predictions not found'))
    render(<MLLabPage />)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Predictions not found')
    fireEvent.click(within(alert).getByRole('button', { name: 'Retry' }))
    await waitFor(() => expect(getPredictions).toHaveBeenCalledTimes(2))
  })

  it('requests selected model and split with limit', async () => {
    render(<MLLabPage />)
    await screen.findByLabelText('Prediction split')
    fireEvent.change(screen.getByLabelText('Prediction split'), { target: { value: 'validation' } })
    await waitFor(() => expect(getPredictions).toHaveBeenCalledWith('model-demo-001', 'validation', expect.any(AbortSignal)))
  })

  it('does not keep old predictions when the new request is pending', async () => {
    let resolve: (value: typeof predictions) => void = () => undefined
    render(<MLLabPage />)
    await screen.findByLabelText('Model')
    expect((await screen.findAllByText('SPY')).length).toBeGreaterThan(0)
    vi.mocked(getPredictions).mockReturnValueOnce(new Promise((next) => { resolve = next }))
    fireEvent.change(screen.getByLabelText('Model'), { target: { value: 'model-demo-002' } })
    expect(screen.queryAllByText('SPY')).toHaveLength(0)
    resolve(predictions)
  })
})
