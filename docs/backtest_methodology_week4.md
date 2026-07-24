# Backtest Methodology — Week 4

## Scope
QuantScope evaluates educational, long-only daily rule-based strategies on the fixed Week 3 US stock/ETF universe. Results are research artifacts, not investment advice.

## Timing convention
A factor and its strategy signal are observed at market close on date t. The engine shifts the signal one trading row within each symbol. The resulting position earns `return_1d` on date t+1. No same-close execution or future factor values are permitted.

## Portfolio construction
Active long-only signals are equal-weighted across symbols on each date. If there are no active symbols, the portfolio is in cash. Position weights are constrained to [0, 1] and total exposure is in [0, 1].

## Costs
Daily turnover is the sum of absolute changes in target positions by symbol, including entry from zero on the first tradable date. Cost is `turnover * (transaction_cost_bps + slippage_bps) / 10_000`. Baseline settings are 5 bps transaction cost and 5 bps slippage.

## Benchmarks
The primary benchmark is SPY buy-and-hold over the same available dates. The secondary descriptive benchmark is equal-weight buy-and-hold across the available strategy universe. Neither applies strategy transaction costs.

## Baseline strategies
- Momentum long-only: active when `momentum_20d > 0`.
- RSI mean-reversion: enter when `rsi_14 <= 30`; remain active until `rsi_14 >= 55`.

## Limitations
Daily adjusted-close data cannot model intraday fills, bid/ask spreads, borrow cost, market impact, delistings, tax, corporate-action data errors, or survivorship bias. A favorable historical result is not evidence of future alpha.