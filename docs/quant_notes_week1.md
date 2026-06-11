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