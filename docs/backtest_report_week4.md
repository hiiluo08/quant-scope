# Backtest Report — Week 4

## Scope and assumptions
This report evaluates the baseline quantitative backtesting engine and strategy results for QuantScope Week 4.
- **Universe**: Fixed Week 3 30-symbol US equities and ETF universe (`AAPL`, `MSFT`, `NVDA`, `AMZN`, `GOOGL`, `META`, `TSLA`, `BRK-B`, `UNH`, `JNJ`, `JPM`, `V`, `PG`, `XOM`, `HD`, `MA`, `BAC`, `ABBV`, `COST`, `CVX`, `MRK`, `WMT`, `AVGO`, `LLY`, `PFE`, `DIS`, `NFLX`, `KO`, `PEP`, `SPY`).
- **Date range**: `2023-01-04` to `2026-06-30` (up to 874 trading days).
- **Engine version**: `v1` (Vectorized, causal, long-only, equal-weighted across active symbols).
- **Cost structure**: `transaction_cost_bps = 5.0`, `slippage_bps = 5.0` (Total modeled friction: 10 bps per unit of turnover).
- **Initial equity**: `1.0`.
- **Timing convention**: Factors and signals observed at close of day `t` are shifted by 1 trading row to establish positions and receive PnL at day `t+1`.
- **Baseline strategies**:
  - `momentum_long_only_v1`: Long when `momentum_20d > 0.0`.
  - `rsi_mean_reversion_v1`: Enter long when `rsi_14 <= 30.0`, hold until `rsi_14 >= 55.0`.

## Data and artifact integrity
- **Processed data source**: `data/processed/ohlcv_20230101_20260701.parquet` (25,483 valid rows).
- **Factor storage source**: `data/factors/` (6 factor datasets).
- **Backtest Artifacts**:
  - `momentum_long_only_v1`: Backtest ID `b04c5807291c1079` (`data/artifacts/backtests/backtest_id=b04c5807291c1079`).
  - `rsi_mean_reversion_v1`: Backtest ID `10ae14eb1ef7dbcf` (`data/artifacts/backtests/backtest_id=10ae14eb1ef7dbcf`).
- **Data health checks**:
  - Zero duplicate `(date, symbol)` keys found.
  - Zero non-finite returns or negative prices.
  - `pytest -q` unit test suite status: **50/50 PASSED**.

## Strategy results

| Metric | `momentum_long_only_v1` | `rsi_mean_reversion_v1` |
|---|---|---|
| **Backtest ID** | `b04c5807291c1079` | `10ae14eb1ef7dbcf` |
| **Trading Days** | 855 | 861 |
| **Total Return** | 33.48% (0.3348) | 59.32% (0.5932) |
| **CAGR** | 8.88% (0.0888) | 14.61% (0.1461) |
| **Annualized Volatility** | 14.52% | 21.35% |
| **Sharpe Ratio** | 0.6589 | 0.7451 |
| **Max Drawdown** | -23.08% (-0.2308) | -17.99% (-0.1799) |
| **Calmar Ratio** | 0.3849 | 0.8118 |
| **Win Rate** | 54.33% | 53.77% |
| **Average Exposure** | 99.88% | 86.18% |
| **Average Turnover** | 28.48% per day | 11.59% per day |

## Benchmark comparison

Both strategies are evaluated against two baseline benchmarks over the exact same period (`2023-01-04` to `2026-06-30`):
1. **SPY (Primary Benchmark)**: Buy-and-hold single-asset benchmark.
2. **Equal-Weight Buy & Hold (Secondary Benchmark)**: Equal-weighted buy-and-hold across all available 30 universe symbols.

| Metric | SPY (Primary) | Equal-Weight (Secondary) | `momentum_long_only_v1` | `rsi_mean_reversion_v1` |
|---|---|---|---|---|
| **Total Return** | **105.08%** | **119.15%** | 33.48% | 59.32% |
| **CAGR** | **23.01%** | **25.38%** | 8.88% | 14.61% |
| **Annualized Volatility** | 15.19% | 13.80% | 14.52% | 21.35% |
| **Sharpe Ratio** | **1.4396** | **1.7081** | 0.6589 | 0.7451 |
| **Max Drawdown** | -18.76% | -17.57% | -23.08% | -17.99% |
| **Calmar Ratio** | 1.2268 | 1.4449 | 0.3849 | 0.8118 |
| **Trading Days** | 874 | 874 | 855 | 861 |

*Note on date ranges*: Strategy trading day counts (855 and 861 days) are slightly shorter than full market history (874 days) due to factor warmup requirements (`momentum_20d` requires 20 sessions; `rsi_14` requires 14 sessions).

## Interpretation
- **Momentum Strategy**: Underperformed buy-and-hold benchmarks significantly during the 2023–2026 period. Frequent rebalancing across 30 symbols generated an average daily turnover of 28.48%, incurring transaction costs that eroded net returns. Additionally, whipsaw price movements during market consolidation phases created drag.
- **RSI Mean-Reversion Strategy**: Achieved a higher total return (59.32%) than Momentum with lower turnover (11.59%), but still lagged the strong overall US equity bull market represented by SPY (+105.08%) and Equal-Weight (+119.15%). The strategy held cash when RSI remained in normal ranges (average exposure of 86.18%), missing some persistent trend gains.

## Limitations
1. **Survivorship Bias**: The 30-symbol universe is selected as of current high-market-cap stocks, ignoring historically delisted or bankrupt companies.
2. **Data Quality & Resolution**: Based on daily adjusted close from Yahoo Finance; intraday price movements, bid-ask spreads, and execution slippage beyond the 5 bps model are not captured.
3. **Execution Modeling**: Assumes perfect market liquidity and equal-weighted execution at daily close without market impact.
4. **No Parameter Tuning**: Strategy parameters (`momentum_20d > 0`, `rsi_14 <= 30 / >= 55`) were fixed prior to backtesting to avoid in-sample overfitting.
5. **No Investment Advice**: Historical backtest results are educational research artifacts and do not indicate future performance or tradability.
