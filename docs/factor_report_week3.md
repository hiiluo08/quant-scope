# Factor Report — Week 3

## Dataset coverage

The QuantScope Week 3 factor dataset covers a fixed universe of **30 US stocks and ETFs**:
`SPY`, `QQQ`, `DIA`, `IWM`, `XLK`, `XLF`, `XLE`, `XLV`, `XLY`, `XLP`, `AAPL`, `MSFT`, `NVDA`, `AMZN`, `GOOGL`, `META`, `TSLA`, `JPM`, `BAC`, `JNJ`, `UNH`, `XOM`, `CVX`, `WMT`, `COST`, `PG`, `KO`, `HD`, `DIS`, `NFLX`.

- **Date Range:** `2023-01-03` to `2026-06-30` (875 trading sessions per symbol).
- **Processed OHLCV Output:** 26,250 total daily records per factor, 157,500 total rows across all 6 factors.
- **Validation Outcome:** Clean zero duplicate `(date, symbol)` keys, zero non-positive prices, zero unhandled missing OHLCV fields.

## Factor definitions

All six factors are calculated causally per symbol and persisted under schema version `v1`:

1. **`momentum_20d`**: $\frac{P_t}{P_{t-20}} - 1$. Warm-up: 20 periods.
2. **`momentum_60d`**: $\frac{P_t}{P_{t-60}} - 1$. Warm-up: 60 periods.
3. **`volatility_20d`**: Rolling 20-day sample standard deviation (`ddof=1`) of simple daily returns. Warm-up: 20 periods.
4. **`rsi_14`**: Wilder-style 14-day Relative Strength Index ($[0, 100]$). Warm-up: 14 periods.
5. **`sma_ratio_20_50`**: $\frac{\text{SMA}_{20}(P_t)}{\text{SMA}_{50}(P_t)} - 1$. Warm-up: 50 periods (requires 50 days for $\text{SMA}_{50}$).
6. **`volume_zscore_20d`**: $\frac{V_t - \mu_{V, 20}}{\sigma_{V, 20}}$ using sample std (`ddof=1`). Warm-up: 20 periods.

## Output quality

- **Symbol Coverage:** 30/30 symbols present for every factor.
- **Duplicate Keys:** 0 duplicate logical keys (`date`, `symbol`, `factor_name`, `factor_version`).
- **Warm-up Missing Values:**
  - `momentum_20d`: 600 missing rows (2.29% rate) — exactly 20 initial `NaN` rows $\times$ 30 symbols.
  - `momentum_60d`: 1,800 missing rows (6.86% rate) — exactly 60 initial `NaN` rows $\times$ 30 symbols.
  - `volatility_20d`: 600 missing rows (2.29% rate) — exactly 20 initial `NaN` rows $\times$ 30 symbols.
  - `rsi_14`: 420 missing rows (1.60% rate) — exactly 14 initial `NaN` rows $\times$ 30 symbols.
  - `sma_ratio_20_50`: 1,470 missing rows (5.60% rate) — 49 initial `NaN` rows $\times$ 30 symbols.
  - `volume_zscore_20d`: 570 missing rows (2.17% rate) — 19 initial `NaN` rows $\times$ 30 symbols.
- **Non-warm-up Missing Values:** 0 unexpected missing values outside designated warm-up periods.

## Distribution observations

- **`momentum_20d`**: Mean = $+0.0182$ (+1.82%), Median = $+0.0185$, Min = $-0.3204$, Max = $+0.7226$. Right-skewed distribution.
- **`momentum_60d`**: Mean = $+0.0552$ (+5.52%), Median = $+0.0553$, Min = $-0.4638$, Max = $+0.9607$. Reflects bull market drift over the 2023–2026 sample.
- **`volatility_20d`**: Mean = $0.0146$ (1.46% daily return std), Median = $0.0129$, Max = $0.0758$ (7.58%). Positive skew with fat right tail.
- **`rsi_14`**: Mean = $54.11$, Median = $54.40$, Min = $8.44$, Max = $97.07$. Symmetric bell-shaped distribution centered slightly above 50.
- **`sma_ratio_20_50`**: Mean = $+0.0114$ (+1.14%), Median = $+0.0097$, Min = $-0.1802$, Max = $+0.2250$.
- **`volume_zscore_20d`**: Mean = $+0.0174$, Median = $-0.1706$, Min = $-2.6685$, Max = $+4.2116$. Right-skewed due to volume surge spikes.
- **Infinity Check:** 0 infinite (`+inf` / `-inf`) values across all factor outputs.

## Correlation observations

Pairwise Pearson correlation matrix on aligned non-null observations:

| Factor | `momentum_20d` | `momentum_60d` | `rsi_14` | `sma_ratio_20_50` | `volatility_20d` | `volume_zscore_20d` |
|---|---|---|---|---|---|---|
| `momentum_20d` | 1.0000 | 0.5426 | 0.7811 | 0.5658 | 0.0610 | -0.0598 |
| `momentum_60d` | 0.5426 | 1.0000 | 0.4851 | 0.8122 | -0.0652 | -0.0370 |
| `rsi_14` | 0.7811 | 0.4851 | 1.0000 | 0.5361 | -0.0210 | -0.1074 |
| `sma_ratio_20_50` | 0.5658 | 0.8122 | 0.5361 | 1.0000 | -0.1415 | -0.0058 |
| `volatility_20d` | 0.0610 | -0.0652 | -0.0210 | -0.1415 | 1.0000 | -0.0213 |
| `volume_zscore_20d` | -0.0598 | -0.0370 | -0.1074 | -0.0058 | -0.0213 | 1.0000 |

- **High Correlation:** `momentum_20d` and `rsi_14` display strong correlation ($r = 0.7811$) as both measure short-term directional price changes. `momentum_60d` and `sma_ratio_20_50` display high correlation ($r = 0.8122$) as both capture medium-term trend strength.
- **Low/Orthogonal Correlation:** `volatility_20d` and `volume_zscore_20d` are virtually uncorrelated with price momentum factors ($|r| < 0.15$), providing distinct, orthogonal feature dimensions for potential multi-factor models.

## Limitations

1. **Survivorship Bias:** The fixed 30-symbol universe contains current market leaders and large-cap ETFs, omitting delisted or bankrupt historical constituents.
2. **Data Source Limitations:** yfinance data may lack corporate action adjustment precision or institutional-grade point-in-time restatements.
3. **Fixed Parameter Baseline:** Window lengths (20d, 60d, 14d, 50d) are fixed baselines and have not been tuned or optimized.
4. **No Alpha Claim:** Factor values describe raw statistical properties of prices and volume. They do not constitute trade signals or proof of strategy profitability.
