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

## Suggested GitHub milestone summary

Week 1 completed the foundation for QuantScope:

- Defined the project scope and MVP boundaries.
- Created a clean repository structure for backend, frontend, ML, data pipeline, infra, docs, and notebooks.
- Studied market data basics: OHLCV, adjusted close, simple return, log return.
- Created the first research notebook using sample market data.
- Drafted the initial data schema for raw, processed, factor, and label data.