# Week 4 Review — Backtesting Engine

## Completed deliverables

All planned deliverables for Week 4 have been implemented, tested, and verified:

1. **Backtesting Contracts & Validation**:
   - `ml/backtesting/__init__.py`: Module package.
   - `ml/backtesting/base.py`: Immutable `BacktestConfig`, schema definitions (`MARKET_COLUMNS`, `SIGNAL_COLUMNS`), and validation functions `prepare_market_data()`, `prepare_signal_frame()`.
2. **Vectorized Backtesting Engine**:
   - `ml/backtesting/engine.py`: Vectorized execution engine `run_backtest()`. Implements 1-day signal shift per symbol, equal-weighted portfolio normalization, cash holding, and transaction cost + slippage accounting.
3. **Performance Metrics & Benchmarks**:
   - `ml/backtesting/metrics.py`: `calculate_metrics()` computing total return, CAGR, annualized volatility, Sharpe ratio, max drawdown, Calmar ratio, win rate, average exposure, and turnover. Includes benchmark builders `build_spy_benchmark()` and `build_equal_weight_benchmark()`.
4. **Baseline Strategies**:
   - `ml/strategies/__init__.py`: Package init.
   - `ml/strategies/base.py`: Abstract `Strategy` class and helper `load_single_factor()`.
   - `ml/strategies/momentum.py`: `MomentumLongOnlyStrategy` implementing `momentum_20d > 0.0`.
   - `ml/strategies/rsi_reversion.py`: `RSIMeanReversionStrategy` implementing RSI hysteresis entry (`<=30.0`) and exit (`>=55.0`).
5. **Artifact Persistence & Storage**:
   - `ml/backtesting/storage.py`: Deterministic SHA-256 ID builder `build_backtest_id()`, artifact saving `save_backtest_result()`, loading `load_backtest_result()`, and listing `list_backtests()`.
6. **FastAPI Read API**:
   - `backend/app/api/routes_backtests.py`: Read-only endpoints `GET /api/v1/backtests`, `GET /api/v1/backtests/{backtest_id}`, and `GET /api/v1/backtests/{backtest_id}/daily`.
7. **Batch Job Runner**:
   - `data_pipeline/jobs/run_backtests.py`: Batch runner `run_baseline_backtests()` executing baseline strategies against processed market data.
8. **Analysis & Reports**:
   - `notebooks/03_backtest_analysis.ipynb`: Analysis notebook.
   - `docs/backtest_methodology_week4.md`: Formal backtesting methodology specification.
   - `docs/backtest_report_week4.md`: Backtest execution report with empirical results.
   - `docs/week4_review.md`: Weekly summary review.

## Verification status

- **Unit Test Suite**: `pytest -q` returned exit code `0` with **50/50 tests passing**.
  - Base input validation tests: `tests/test_backtesting_base.py` (3 passed).
  - Engine causality & cost tests: `tests/test_backtesting_engine.py` (4 passed).
  - Metrics & benchmark tests: `tests/test_backtesting_metrics.py` (4 passed).
  - Strategy unit tests: `tests/test_strategies_momentum.py` (2 passed), `tests/test_strategies_rsi_reversion.py` (3 passed).
  - Storage & API tests: `tests/test_backtesting_storage.py` (2 passed), `tests/test_routes_backtests.py` (2 passed).
  - Batch runner orchestration test: `tests/test_run_backtests.py` (1 passed).
- **Batch Backtest Run**:
  - `momentum_long_only_v1`: Backtest ID `b04c5807291c1079`
  - `rsi_mean_reversion_v1`: Backtest ID `10ae14eb1ef7dbcf`
- **FastAPI Endpoints**: Verified via TestClient and local server routing.

## Key lessons

1. **Strict Signal Causality**: Factor and signal generated at market close on date `t` must be shifted by 1 trading session (`shift(1)`) so that exposure and returns occur on date `t+1`. This prevents lookahead bias.
2. **Cross-Sectional Normalization**: Active target signals must be shifted per symbol *before* cross-sectional equal-weighting across symbols on each trading date.
3. **Turnover-Based Cost Friction**: Transaction cost must be calculated from portfolio turnover: `turnover * (transaction_cost_bps + slippage_bps) / 10_000`. High turnover strategies (e.g. daily momentum rebalancing) suffer significant drag.
4. **Benchmark Selection**: Comparing strategies against both SPY and equal-weighted buy-and-hold over identical trading date ranges provides clear context on whether strategy rules generate real value or simply lag passive market exposure.

## Known limitations

- **Data Source**: Daily OHLCV from Yahoo Finance lacks intraday bid-ask spread data or order book depth.
- **Execution Model**: Assumes perfect close-price fills without market impact beyond fixed 5 bps slippage.
- **Survivorship Bias**: Universe consists of currently active S&P 500 constituents; delisted stocks are omitted.
- **No Live Fills**: Results reflect educational simulation only.

## Next Week focus

Week 5 will focus on **Machine Learning Alpha Modeling**:
1. Constructing forward-return targets (`forward_return_5d`, `forward_return_10d`, `forward_return_20d`) without data leakage.
2. Building feature matrices from stored factors.
3. Time-series cross-validation (Purged Group TimeSeries Split / Walk-Forward Split).
4. Training ML ranking models (e.g. LightGBM / XGBoost / Ridge) to generate signals for the Week 4 backtest engine.
