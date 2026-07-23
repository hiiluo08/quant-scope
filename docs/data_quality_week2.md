# Data Quality Report — Week 2

## Scope

This report describes the existing processed-data snapshot after the pipeline ran. Download, normalization, and S3 synchronization were not run again during this review.

## Summary

- Tickers: `AAPL`, `SPY` (2 tickers)
- Date range: 2022-01-03 to 2024-12-30
- Total rows: 1,504
- Valid rows: 1,502 according to the `is_valid` flag (99.87%)

> The first row for each ticker has no `return_1d` or `log_return_1d` because there is no prior trading session. This is expected return-calculation behavior, not missing market data.

## Validation Results

| Check | Count | Notes |
|---|---:|---|
| Missing `date`, `symbol`, `adjusted_close`, or `volume` | 0 | Required columns are complete. |
| Missing `return_1d` / `log_return_1d` | 2 per column | The first row of `AAPL` and `SPY`; expected. |
| Duplicate rows by `date`, `symbol` | 0 | No duplicate natural keys were found. |
| Zero-volume rows | 0 | None found in this snapshot. |
| Negative or zero adjusted price | 0 | None found in this snapshot. |
| Extreme returns (absolute return > 50%) | 0 | None found in this snapshot. |

## Known Limitations

- The snapshot contains only 2 tickers and does not yet meet the Day 14 objective of at least 5 tickers.
- Using current tickers introduces survivorship bias.
- yfinance is convenient for learning, but it does not guarantee complete or accurate data for every symbol and date.
- This report does not re-verify the S3 upload because no AWS operation was run during this review.

## Conclusion

The implemented quality checks found no serious data-quality issues in the processed snapshot. The next step is to expand the ticker universe and retain validation checks before using the data for factor research or backtesting.
