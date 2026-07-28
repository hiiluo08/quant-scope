# ML Report — Week 5

> **QuantScope Machine Learning Alpha Prediction Report**  
> **Target:** 5-day forward return `forward_return_5d(t) = adjusted_close(t+5) / adjusted_close(t) - 1`  
> **Model Families:** XGBoost (`XGBRegressor`) & LightGBM (`LGBMRegressor`)  
> **Date:** 2026-07-28  

---

## 1. Dataset and Leakage Controls

### Universe and Data Coverage
- **Universe:** 30 US large-cap equities and broad market ETFs from Week 3 fixed universe (`AAPL`, `MSFT`, `NVDA`, `AMZN`, `GOOGL`, `META`, `TSLA`, `BRK-B`, `JNJ`, `JPM`, `V`, `PG`, `UNH`, `HD`, `MA`, `DIS`, `BAC`, `XOM`, `PFE`, `CSCO`, `INTC`, `AMD`, `NFLX`, `PEP`, `KO`, `COST`, `WMT`, `QQQ`, `IWM`, `SPY`).
- **Date Range:** 2023-01-03 to 2026-06-23 (874 total trading days).
- **Features (`v1`):** `momentum_20d`, `momentum_60d`, `volatility_20d`, `rsi_14`, `sma_ratio_20_50`, `volume_zscore_20d`.
- **Feature Version Integrity:** Enforced exact version `v1` across all six Parquet factor stores. Any feature missing or possessing multi-version drift is rejected during dataset assembly.
- **Labels:** `forward_return_5d(t)` calculated strictly per symbol via `groupby("symbol")["adjusted_close"].shift(-5) / adjusted_close - 1`. The last 5 trading days per symbol evaluate to `NaN` and are dropped prior to splitting.
- **Row Counts & Filtering:**
  - Raw market rows: 26,220 rows across 30 symbols.
  - Complete cases after dropping factor warm-up rows (first 60 trading days) and tail label rows (last 5 trading days): 24,060 rows.
  - Excluded rows: 2,160 rows (dropped explicitly for missing feature history or missing future labels; no imputation or backfilling).

### Chronological Split & Embargo
To prevent lookahead leakage and target overlap, splitting is performed strictly across unique trading dates in chronological order:
- **Raw Split Allocation:** 60% Train / 20% Validation / 20% Test.
- **Embargo Rule:** Exactly 5 trading days purged between Train and Validation, and 5 trading days purged between Validation and Test.
- **Split Dates & Boundaries:**
  - **Train:** 2023-03-30 to 2025-02-28 (481 trading dates, 14,430 rows).
  - **Embargo 1:** 2025-03-03 to 2025-03-07 (5 purged trading dates).
  - **Validation:** 2025-03-10 to 2025-10-21 (157 trading dates, 4,710 rows).
  - **Embargo 2:** 2025-10-22 to 2025-10-28 (5 purged trading dates).
  - **Test:** 2025-10-29 to 2026-06-23 (162 trading dates, 4,860 rows).

---

## 2. Model Configurations

Both baseline models were trained on the exact same training split (`X_train`, `y_train`) using CPU single-threaded execution (`n_jobs=1`) and standard seed `random_state=42`. Early stopping (25 rounds) was evaluated against the validation split (`X_validation`, `y_validation`).

### XGBoost Baseline
- **Class:** `xgboost.XGBRegressor`
- **Parameters:** `tree_method="hist"`, `objective="reg:squarederror"`, `eval_metric="rmse"`, `n_estimators=500`, `max_depth=3`, `learning_rate=0.03`, `subsample=0.8`, `colsample_bytree=0.8`, `reg_lambda=1.0`, `random_state=42`, `n_jobs=1`, `early_stopping_rounds=25`.
- **Artifact:** `data/artifacts/models/model_id=4150bdf3bd8745d8/` (`model.json`)

### LightGBM Baseline
- **Class:** `lightgbm.LGBMRegressor`
- **Parameters:** `objective="regression"`, `n_estimators=500`, `num_leaves=15`, `learning_rate=0.03`, `subsample=0.8`, `colsample_bytree=0.8`, `reg_lambda=1.0`, `random_state=42`, `n_jobs=1`, `early_stopping_rounds=25`.
- **Artifact:** `data/artifacts/models/model_id=8dbd23bf4929e497/` (`model.txt`)

---

## 3. Validation Model Selection

Model selection was governed strictly by validation performance. Test set metrics were kept hidden during champion selection.

### Validation Performance Summary

| Model Family | Model ID | Validation RMSE | Validation MAE | Validation Rank IC | Directional Accuracy | Selection Outcome |
|---|---|---|---|---|---|---|
| **LightGBM** | `8dbd23bf4929e497` | **0.040634** | **0.026923** | **0.134766** | 60.30% | **Champion** |
| **XGBoost** | `4150bdf3bd8745d8` | 0.040856 | 0.027112 | 0.120399 | 60.38% | Baseline |

### Decision Rule Rationale
1. **Primary Metric:** Validation RMSE. LightGBM achieved a lower validation RMSE (`0.040634` vs `0.040856`).
2. **Secondary Metric (Tie-Break):** Spearman Rank IC on validation set. LightGBM achieved `0.134766` vs XGBoost `0.120399`.
3. **Outcome:** LightGBM was deterministically selected as the **Champion Model**.

---

## 4. Test-Period Results

Test set predictions were evaluated post-selection to assess out-of-sample performance across 162 holdout trading days (2025-10-29 to 2026-06-23).

### Test Metrics Summary

| Model Family | Model ID | Test RMSE | Test MAE | Test Rank IC | Directional Accuracy |
|---|---|---|---|---|---|
| **LightGBM (Champion)** | `8dbd23bf4929e497` | 0.037187 | 0.027720 | **0.011645** | 52.70% |
| **XGBoost** | `4150bdf3bd8745d8` | 0.037122 | 0.027655 | -0.000526 | 52.82% |

### Observations
- Rank IC degraded significantly from validation (`~0.135`) to test (`~0.012`), demonstrating typical regime shift and out-of-sample difficulty in 5-day daily cross-sectional return prediction.
- Directional accuracy remained slightly above 50% (`52.70%` for LightGBM), confirming that predictive power in financial time-series is weak and noisy.

---

## 5. Ranking-Backtest Comparison

The champion model (`LightGBM`) test-period predictions were converted into daily long signals via `MLTopKRankStrategy(top_k=5)`. The top 5 highest-predicted symbols per date were assigned target weights of `20%` each (alphabetical tie-breaking on tied predictions). Signals were executed using the Week 4 cost-aware engine (1-day execution lag, 5 bps transaction costs, 5 bps slippage).

### Backtest Period: 2025-10-29 to 2026-06-23 (162 trading days)

| Metric | `ml_top_5_rank_v1` (LightGBM) | Benchmark: SPY Buy & Hold | Benchmark: Equal-Weight B&H |
|---|---|---|---|
| **Total Return** | **+11.87%** | +7.66% | +6.25% |
| **CAGR** | **19.07%** | 12.16% | 9.89% |
| **Sharpe Ratio** | **0.9702** | 0.9097 | 0.9658 |
| **Max Drawdown** | -11.90% | -8.88% | **-6.36%** |
| **Calmar Ratio** | **1.6023** | 1.3685 | 1.5554 |
| **Annualized Volatility** | 20.05% | 13.63% | 10.32% |
| **Average Exposure** | 99.38% | 100.00% | 100.00% |
| **Daily Turnover** | 51.48% | 0.00% | 0.00% |
| **Daily Win Rate** | 53.42% | 54.94% | 50.62% |

### Key Backtest Insights
1. **Performance:** The top-5 ranking strategy achieved +11.87% total return over the 162-day test period, outperforming SPY (+7.66%) and Equal-Weight Buy & Hold (+6.25%).
2. **Turnover & Costs:** Daily turnover was high (51.48%) due to daily top-5 rank rebalancing. Even after deducting 10 bps total round-trip friction (5 bps commission + 5 bps slippage), net Sharpe ratio remained positive (0.97).
3. **Volatility:** Strategy volatility (20.05%) was higher than SPY (13.63%) due to holding a concentrated 5-stock portfolio.

---

## 6. Limitations and Future Improvements

1. **Survivorship Bias:** Universe is fixed to 30 currently listed large-cap tickers.
2. **Data Source:** Daily adjusted close data from `yfinance` does not account for intraday execution dynamics or real-time orderbook queueing.
3. **Holdout Window:** The test period spans 162 trading days; multi-year macroeconomic regimes need to be tested before concluding robust alpha.
4. **Feature Complexity:** Features are restricted to 6 basic technical indicators (`v1`). Adding macroeconomic features, cross-sectional factor z-scores, and fundamental signals represents a natural next step.
5. **No Shorting or Portfolio Optimization:** The strategy uses simple equal-weight top-5 long allocation without mean-variance constraints or shorting capability.
