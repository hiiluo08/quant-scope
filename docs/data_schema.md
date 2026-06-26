# Data Schema

QuantScope stores market data in three layers:

1. Raw data: original downloaded OHLCV data.
2. Processed data: normalized schema used by factors and backtests.
3. Research artifacts: factors, labels, model predictions, backtest results.

## Raw OHLCV data

| Field | Type | Example | Note |
|---|---|---|---|
| date | date | 2025-01-02 | Trading date, format YYYY-MM-DD |
| symbol | string | SPY | Uppercase ticker |
| open | float | 584.23 | Raw open price |
| high | float | 586.10 | Raw high price |
| low | float | 580.50 | Raw low price |
| close | float | 582.90 | Raw close price |
| adjusted_close | float | 582.90 | Adjusted for split/dividend if available |
| volume | integer | 52300000 | Daily volume |
| source | string | yfinance | Data provider |
| ingested_at | datetime | 2026-06-10T10:30:00Z | UTC ingestion time |

## Processed OHLCV schema

| Field | Type | Example | Note |
|---|---|---|---|
| date | date | 2025-01-02 | Trading date |
| symbol | string | SPY | Uppercase ticker |
| adjusted_close | float | 582.90 | Main price for returns |
| volume | integer | 52300000 | Daily volume |
| return_1d | float | 0.0123 | Simple daily return |
| log_return_1d | float | 0.0122 | Log daily return |
| is_valid | boolean | true | Data quality flag |

## Factor schema draft

| Field | Type | Example | Note |
|---|---|---|---|
| date | date | 2025-01-02 | Factor date |
| symbol | string | SPY | Ticker |
| factor_name | string | momentum_20d | Factor identifier |
| factor_value | float | 0.052 | Raw factor value |
| factor_version | string | v1 | Version for reproducibility |
| computed_at | datetime | 2026-06-10T12:00:00Z | UTC computation time |

## Label schema draft

| Field | Type | Example | Note |
|---|---|---|---|
| date | date | 2025-01-02 | Feature date |
| symbol | string | SPY | Ticker |
| label_name | string | forward_return_5d | Label identifier |
| label_value | float | 0.018 | Future return |
| horizon_days | integer | 5 | Prediction horizon |

## File layout draft

```text
data/
├── raw/
│   └── source=yfinance/
│       └── prices_YYYYMMDD.parquet
├── processed/
│   └── ohlcv_daily.parquet
├── factors/
│   └── factor_name=momentum_20d/
│       └── values.parquet
└── artifacts/
    ├── models/
    └── backtests/
```

## Date and time conventions

- Trading dates use `YYYY-MM-DD`.
- Timestamps use UTC ISO 8601, for example `2026-06-10T12:00:00Z`.
- The project avoids timezone-aware intraday data in MVP.