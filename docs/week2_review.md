# Week 2 Review — Data Pipeline

## Available Deliverables

- Market data downloader: `data_pipeline/ingestion/download.py`
- OHLCV normalization and Parquet I/O: `data_pipeline/processing/normalize.py`
- Local storage layout: `data_pipeline/storage/local_store.py`
- Data validation: `data_pipeline/processing/validate.py`
- S3 upload/download utility: `data_pipeline/storage/s3_client.py`
- FastAPI market data API: `backend/app/main.py` and `backend/app/api/routes_market_data.py`
- [Data quality report](data_quality_week2.md)

## Verification Status

- **Verified locally:** The processed Parquet snapshot contains 1,504 rows for `AAPL` and `SPY`. Validation found no missing required values, duplicates, zero-volume rows, non-positive prices, or extreme returns.
- **Smoke-tested locally:** `/health`, the symbols endpoint, limited `SPY` OHLCV data, and the `SPY` return series all returned HTTP 200.
- **Confirmed by the user:** The end-to-end pipeline, including S3 synchronization, ran successfully earlier. It was not re-run during this review.
- **Not yet met or re-verified:** The Day 14 criterion that the API return data for at least 5 tickers. The current snapshot contains only 2 tickers.

## Key Lessons

- Sort by date and use `groupby("symbol")` before calculating returns to prevent cross-symbol contamination.
- Parquet preserves data types and is better suited than CSV for financial-data pipelines.
- Data validation should detect anomalies before data is automatically deleted or altered.
- APIs should return meaningful HTTP status codes, limit response sizes, and use Swagger/OpenAPI to validate their contracts quickly.

## Security Reminders

- Never commit `.env` files, access keys, or secrets.
- `AmazonS3FullAccess` is only a temporary development/learning setup. Production should use least-privilege IAM policies scoped to the required actions, bucket, and prefixes.

## Known Limitations

- The current universe contains only `AAPL` and `SPY`; more tickers are required before broader evaluation.
- yfinance data and the current ticker universe have data-quality and survivorship-bias limitations.
- S3 synchronization is recorded from the earlier user-confirmed run and was not repeated during this review.

## Next Week Focus

Week 3 will build the Factor Engine:

1. Design a `Factor` base interface.
2. Implement momentum, volatility, RSI, SMA-ratio, and volume z-score factors.
3. Build a factor registry to calculate and manage multiple factors.
4. Add factor API endpoints.
5. Expand the data universe before using factors for analysis and backtesting.
