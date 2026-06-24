# Quant Notes — Week 1

## Purpose

These notes go with `notebooks/01_market_data_basics.ipynb`.

The goal is to build a basic understanding of market data before moving on to factors, strategies, backtesting, and machine learning.

---

## 1. OHLCV

OHLCV stands for:

- **Open**: the first traded price of the session
- **High**: the highest traded price of the session
- **Low**: the lowest traded price of the session
- **Close**: the last traded price of the session
- **Volume**: the number of shares traded during the session

### Why OHLCV matters

OHLCV is the basic input for most quantitative trading workflows.

Examples:

- Close price is often used to compute returns.
- High and low are useful for range and volatility analysis.
- Volume can be used to measure liquidity or attention.

---

## 2. Adjusted Close

Adjusted close is the closing price after accounting for stock splits and dividends.

### Why it matters

For long-term return analysis, adjusted close is usually better than raw close.

If you use raw close after a stock split or dividend event, your return series can become misleading.

### Practical rule

- Use **adjusted close** for long-term return calculations.
- Use **close** only when you have a clear reason and understand the trade-off.

---

## 3. Simple Return

Simple return measures percentage price change from one period to the next.

Formula:

```text
return_t = price_t / price_{t-1} - 1
```

Example:

```text
yesterday price = 100
today price = 105
return = 105 / 100 - 1 = 0.05 = 5%
```

### Why it matters

Simple return is easy to interpret and is often the best starting point for beginners.

---

## 4. Log Return

Log return is the natural log of the price ratio between two consecutive periods.

Formula:

```text
log_return_t = log(price_t / price_{t-1})
```

### Why it matters

Log returns are useful in time-series analysis because they add more naturally over time.

### Practical rule

- Use **simple return** when you want something easy to explain.
- Use **log return** when you want a more standard quantitative formulation.

---

## 5. Missing Data

Missing data is common in financial datasets.

It can happen because:

- a ticker was not trading during part of the period
- data provider issues occurred
- some assets have different trading histories
- holidays or special market events created gaps

### Why it matters

If you ignore missing values, you can get:

- incorrect return calculations
- broken charts
- misleading backtest results
- unfair comparisons across tickers

### Practical rule

Always check for missing values before computing returns or building signals.

---

## 6. Why sorting by date matters

Return calculations depend on the previous observation.

If your data is not sorted by date, then `pct_change()` or `shift(1)` may compare the wrong rows.

That means the return series becomes invalid even if the formula itself is correct.

### Practical rule

Always make sure your time series is in chronological order before computing returns.

---

## 7. Sample Tickers Used in the Notebook

The notebook uses five example tickers:

- **SPY**: broad US equity market benchmark
- **QQQ**: Nasdaq-heavy growth benchmark
- **AAPL**: large-cap technology stock
- **MSFT**: large-cap technology stock
- **TSLA**: high-volatility growth stock

### Why this set is useful

This group gives you:

- two benchmark-style ETFs
- two large-cap tech names
- one more volatile stock

That makes it easier to compare different return and volatility patterns.

---

## 8. What the notebook is teaching you

By the end of the notebook, you should be able to:

- download price data for multiple tickers
- inspect the dataset structure
- extract adjusted close
- compute simple and log returns
- check missing values
- plot price and return charts
- save a local sample dataset

---

## 9. Draft Answers for Reflection Questions

These are starter answers. You can keep them, shorten them, or rewrite them in your own words.

### Q1. Why is adjusted close usually better than close for long-term backtests?

**Draft answer:**
Adjusted close is usually better because it accounts for stock splits and dividends. If raw close is used over a long period, those events can distort return calculations and make performance look wrong.

### Q2. Which ticker looks the most volatile in the sample?

**Draft answer:**
A ticker like TSLA will often look more volatile than SPY or QQQ because its daily returns tend to have a wider spread. The final answer should be confirmed by checking the daily volatility output in the notebook.

### Q3. Does the return distribution look centered around 0?

**Draft answer:**
For daily returns, the distribution is usually roughly centered around 0, but it is rarely perfectly symmetric. Most daily moves are small, with a few larger positive or negative moves in the tails.

### Q4. How could missing data distort later analysis?

**Draft answer:**
Missing data can distort return calculations, break rolling statistics, and create misleading comparisons across assets. If not handled carefully, it can also produce incorrect backtest signals.

---

## 10. Suggested Personal Summary

If you want a short summary for yourself, you can use this:

> OHLCV is the basic structure of market data. For long-term research, adjusted close is often the safest price series for return calculations. Before doing any quant analysis, I need to inspect the data, sort it correctly, check missing values, and understand what each column actually means.

---

## 11. Factor, Alpha, Signal, and Position

### Factor
A factor is a quantitative variable calculated from market data (or alternative data) used to explain or predict returns and risks.
- **Example**: `momentum_20d = close_today / close_20_days_ago - 1` (If `momentum_20d` is high, we assume the asset is trending upwards).

### Alpha
Alpha is the excess return of an investment relative to the return of a benchmark index or adjusted for risk.
In this project, alpha simply means a signal that helps the strategy outperform the benchmark.

### Signal
A signal converts factor values into trading intent.
- **Example**:
  ```python
  if momentum_20d > 0:
      signal = 1  # Long
  else:
      signal = 0  # No position
  ```

### Position
Position is the actual trading state implemented after receiving the signal.
- **Crucial Rule**:
  `factor_t -> signal_t -> position_{t+1}`
  You must shift the position to the next trading period to avoid **look-ahead bias** (using information from the future that wouldn't be available at the time of the trade decision).

### Label
A label is the target variable that a Machine Learning model tries to predict.
- **Example**: `forward_return_5d = close_{t+5} / close_t - 1`
  The model learns mapping: `features_t -> predict forward_return_5d`.

---

## 12. Factor Taxonomy

| Factor Type | Example | Input | Purpose |
|---|---|---|---|
| Momentum | 20d return | Close / Adjusted Close | Capture price trends |
| Volatility | Rolling standard deviation | Returns | Measure risk / uncertainty |
| Mean Reversion | RSI (Relative Strength Index) | Close | Find overbought / oversold states |
| Volume | Volume Z-Score | Volume | Measure attention / liquidity |
| Trend | SMA Ratio (e.g., SMA_50 / SMA_200) | Close | Measure short-term vs long-term trend |

---

## 13. Factor -> Signal -> Position Workflow Example

Here is a step-by-step example:

**Day t:**
- `close` = 105
- `close` 20 days ago = 100
- `momentum_20d` = `105 / 100 - 1` = 5%
- `signal_t` = 1 (since `momentum_20d` > 0)

**Day t+1:**
- Apply `position` = 1 (active trade starts)
- Compute PnL using the return of day `t+1` (`return_{t+1}`)

---

## 14. Workflow Diagrams

### Standard Quant Workflow
```text
Market Data
    |
    v
Factor
    |
    v
Signal
    |
    v
Position
    |
    v
PnL / Backtest Metrics
```

### ML-Based Alpha Flow
```text
Market Data
    |
    v
Factors / Features at day t
    |
    v
ML Model
    |
    v
Predict Future Return (Label)
    |
    v
Ranking / Trading Signal
```

---

## 15. Day 3 Reflection Questions & Answers

### Q1. How does a factor differ from a signal?
A **factor** is a continuous numerical value calculated from historical data (e.g., standard deviation, momentum percentage). A **signal** is a discrete decision or action generated based on that factor (e.g., Buy, Sell, Hold, or 1, -1, 0) to express trading intent.

### Q2. How does a signal differ from a position?
A **signal** is the *intent* to trade generated at time `t` (e.g., buy tomorrow). A **position** is the *actual execution/holding state* active in the market at time `t+1` as a result of that signal.

### Q3. What is a label in ML finance?
A **label** is the target outcome (ground truth) that the ML model attempts to predict. In quantitative finance, this is typically a future forward return over a specific horizon (e.g., `forward_return_5d`).

### Q4. Why must we not use a factor at day `t` to trade at day `t` if the factor is calculated using the close price of day `t`?
If a factor uses the closing price of day `t`, that closing price is only known at the very end of day `t`. If you trade during day `t` using that factor, you are using future information that you did not actually have at the time of trading. This introduces **look-ahead bias**, making your backtest results artificially profitable and impossible to replicate in live trading.