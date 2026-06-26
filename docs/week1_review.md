# Week 1 Review

## Completed

- Initialized project structure
- Defined QuantScope MVP scope
- Learned OHLCV and return basics
- Created market data basics notebook
- Downloaded sample market data
- Designed initial data schema

## Key lessons

- Adjusted close is preferred for long-term return calculations.
- Signals must be shifted before backtesting to avoid look-ahead bias.
- Data schema matters before building data pipelines.

## Problems encountered

- [Write any yfinance/data/environment issues]

## Next week focus

Week 2 will focus on data pipeline implementation:

- Market data downloader module
- Parquet normalization
- Local storage layout
- S3 upload/download utility
- FastAPI market data endpoints