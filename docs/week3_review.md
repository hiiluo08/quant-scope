# Week 3 Review — Factor Engine

## Available deliverables

- **Universe Rebuild Job:** [data_pipeline/jobs/rebuild_universe.py](file:///run/media/hulu/Works/TTNT_253/quant-scope/data_pipeline/jobs/rebuild_universe.py)
- **Factor Base Interface:** [ml/factors/base.py](file:///run/media/hulu/Works/TTNT_253/quant-scope/ml/factors/base.py)
- **Factor Implementations:**
  - Momentum: [ml/factors/momentum.py](file:///run/media/hulu/Works/TTNT_253/quant-scope/ml/factors/momentum.py)
  - Volatility: [ml/factors/volatility.py](file:///run/media/hulu/Works/TTNT_253/quant-scope/ml/factors/volatility.py)
  - Volume Z-Score: [ml/factors/volume.py](file:///run/media/hulu/Works/TTNT_253/quant-scope/ml/factors/volume.py)
  - Technical (RSI & SMA Ratio): [ml/factors/technical.py](file:///run/media/hulu/Works/TTNT_253/quant-scope/ml/factors/technical.py)
- **Factor Registry:** [ml/factors/registry.py](file:///run/media/hulu/Works/TTNT_253/quant-scope/ml/factors/registry.py)
- **Factor Storage:** [ml/factors/storage.py](file:///run/media/hulu/Works/TTNT_253/quant-scope/ml/factors/storage.py)
- **FastAPI Factor Endpoints:** [backend/app/api/routes_factors.py](file:///run/media/hulu/Works/TTNT_253/quant-scope/backend/app/api/routes_factors.py)
- **Test Suite (29 tests):** [tests/](file:///run/media/hulu/Works/TTNT_253/quant-scope/tests/)
- **Exploratory Data Analysis Notebook:** [notebooks/02_factor_eda.ipynb](file:///run/media/hulu/Works/TTNT_253/quant-scope/notebooks/02_factor_eda.ipynb)
- **Factor Report:** [docs/factor_report_week3.md](file:///run/media/hulu/Works/TTNT_253/quant-scope/docs/factor_report_week3.md)

## Verification status

- **Pytest Suite:** `pytest -q` passed 29/29 tests in 1.01s.
- **Universe Rebuild Execution:** `python -m data_pipeline.jobs.rebuild_universe --start-date 2023-01-01 --end-date 2026-07-01 --compute-factors` generated:
  - 1 processed OHLCV file with 30 symbols, 875 trading sessions per symbol (26,250 rows).
  - 6 factor Parquet files under `data/factors/factor_name=*/values.parquet` (157,500 total rows).
- **FastAPI Smoke Test:**
  - `GET /health` -> `200 OK`
  - `GET /api/v1/factors` -> `200 OK`, count = 6 metadata items.
  - `GET /api/v1/factors/momentum_20d?symbol=SPY&limit=5` -> `200 OK`, 5 filtered records.
  - `GET /api/v1/factors/rsi_14/latest` -> `200 OK`, 30 non-null latest values.

## Key lessons

1. **Symbol Isolation is Essential:** Grouping operations by `symbol` before rolling or shift calculations prevents data leakage across symbol boundaries.
2. **Warm-up NaN Handling:** Warm-up period `NaN` values are expected statistical properties of rolling windows and must be preserved, not filled with zeros.
3. **Causal Computation Contract:** Values computed at date $t$ strictly consume data available through $t$.
4. **Factor Versioning:** Explicit version tags (`v1`) ensure traceability when factor definitions or formulas evolve.
5. **Factor vs. Signal / Alpha:** A factor is a quantitative feature input, not a buy/sell trade signal or a guarantee of excess returns.

## Known limitations

1. **Survivorship Bias:** The fixed 30-symbol US stock/ETF universe represents current market liquid assets and excludes historical delistings.
2. **yfinance Data Constraints:** Free yfinance data lacks institutional-grade tick accuracy or corporate action point-in-time adjustments.
3. **Storage Format:** Local Parquet storage is optimized for single-machine MVP research; scaling to multi-gigabyte tick datasets will require distributed storage in future phases.
4. **No Backtest Results Yet:** Strategy signals, portfolio formation, transaction costs, and backtesting metrics are deferred to Week 4.

## Next Week focus

Week 4 will consume factor values at date $t$ to generate trading signals at date $t$, executing positions and calculating PnL starting from date **$t+1$** (preventing look-ahead bias), incorporating transaction costs, slippage, and benchmarking against `SPY`.
