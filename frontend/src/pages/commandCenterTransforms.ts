import type {
  BacktestMetadata,
  DailyBacktestRow,
  ModelManifest,
  PredictionRow,
  FactorMetadata,
  FactorResponse
} from '../api/types'

export interface StrategyHealth {
  strategy_name: string
  end_date: string
  cagr: number
  sharpe_ratio: number
  max_drawdown: number
  average_exposure: number
}

export function deriveStrategyHealth(backtest: BacktestMetadata | undefined): StrategyHealth | null {
  if (!backtest || !backtest.metrics) return null
  return {
    strategy_name: backtest.strategy_name,
    end_date: backtest.end_date,
    cagr: typeof backtest.metrics.cagr === 'number' ? backtest.metrics.cagr : 0,
    sharpe_ratio: typeof backtest.metrics.sharpe_ratio === 'number' ? backtest.metrics.sharpe_ratio : 0,
    max_drawdown: typeof backtest.metrics.max_drawdown === 'number' ? backtest.metrics.max_drawdown : 0,
    average_exposure: typeof backtest.metrics.average_exposure === 'number' ? backtest.metrics.average_exposure : 0
  }
}

export interface SignalRow {
  symbol: string
  prediction: number
  date: string
}

export function extractTopSignals(predictions: PredictionRow[] | undefined): SignalRow[] {
  if (!predictions || predictions.length === 0) return []
  const latestDate = predictions.reduce((max, p) => p.date > max ? p.date : max, predictions[0].date)
  const latest = predictions.filter(p => p.date === latestDate)
  return latest
    .sort((a, b) => b.prediction - a.prediction)
    .slice(0, 5)
    .map(p => ({
      symbol: p.symbol,
      prediction: p.prediction,
      date: p.date
    }))
}

export interface FactorLeader {
  symbol: string
  factor_value: number
}

export function deriveFactorLeaders(factorValues: FactorResponse | undefined): FactorLeader[] {
  if (!factorValues || !factorValues.data || factorValues.data.length === 0) return []
  const latestDate = factorValues.data.reduce((max, d) => d.date > max ? d.date : max, factorValues.data[0].date)
  const latest = factorValues.data.filter(d => d.date === latestDate && d.factor_value !== null)
  return latest
    .sort((a, b) => b.factor_value! - a.factor_value!)
    .slice(0, 5)
    .map(d => ({
      symbol: d.symbol,
      factor_value: d.factor_value!
    }))
}

export interface CommandCenterInputs {
  backtest?: BacktestMetadata
  daily?: DailyBacktestRow[]
  model?: ModelManifest
  predictions?: PredictionRow[]
  factor?: FactorMetadata
  latestFactors?: FactorResponse
}
