export type MarketRow = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjusted_close: number;
};

export type MarketResponse = {
  symbol: string;
  count: number;
  data: MarketRow[];
};

export type SymbolsResponse = {
  symbols: string[];
  count: number;
};

export type FactorMetadata = {
  name: string;
  version: string;
  warmup_periods: number;
  parameters?: Record<string, any>;
};

export type FactorCatalogResponse = {
  factors: FactorMetadata[];
  count: number;
};

export type FactorValue = {
  date: string;
  symbol: string;
  factor_name: string;
  factor_value: number | null;
  factor_version: string;
  computed_at: string;
};

export type FactorResponse = {
  factor_name: string;
  factor_version: string;
  count: number;
  data: FactorValue[];
};

export type NumericMetric = number | null;
export type BacktestMetricName =
  | "total_return"
  | "cagr"
  | "annualized_volatility"
  | "sharpe_ratio"
  | "max_drawdown"
  | "average_turnover"
  | "average_exposure"
  | "calmar_ratio"
  | "win_rate"
  | "trading_days";
export type BacktestMetricMap = Partial<
  Record<BacktestMetricName, NumericMetric>
> &
  Record<string, NumericMetric>;
export type BenchmarkMetric = Partial<
  Record<BacktestMetricName, NumericMetric>
> &
  Record<string, unknown>;

export type BacktestMetadata = {
  backtest_id: string;
  strategy_name: string;
  engine_version: string;
  start_date: string;
  end_date: string;
  factor_versions: Record<string, string>;
  transaction_cost_bps: number;
  slippage_bps: number;
  initial_equity: number;
  metrics: BacktestMetricMap;
  selection: string;
  champion_model_id?: string;
  benchmarks: Record<string, BenchmarkMetric>;
};

export type DailyBacktestRow = {
  date: string;
  gross_return: number;
  turnover: number;
  transaction_cost: number;
  net_return: number;
  portfolio_exposure: number;
  equity_curve: number;
};

export type BacktestListResponse = {
  backtests: BacktestMetadata[];
  count: number;
};
export type BacktestDailyResponse = {
  backtest_id: string;
  count: number;
  data: DailyBacktestRow[];
};

export type ModelFamily = "xgboost" | "lightgbm";
export type ModelMetricMap = Record<string, number | null>;
export type PredictionSplit = "validation" | "test";

export type ModelManifest = {
  model_id: string;
  model_file: string;
  family: ModelFamily;
  feature_columns: string[];
  factor_versions: Record<string, string>;
  label: { name: string; horizon_days: number };
  split_dates: Record<string, string>;
  parameters: Record<string, unknown>;
  metrics: { validation: ModelMetricMap; test: ModelMetricMap };
};

export type ModelListResponse = { models: ModelManifest[]; count: number };
export type PredictionRow = {
  date: string;
  symbol: string;
  forward_return_5d: number;
  prediction: number;
  split: PredictionSplit;
  model_id: string;
};
export type PredictionResponse = {
  model_id: string;
  split: PredictionSplit;
  count: number;
  data: PredictionRow[];
};
