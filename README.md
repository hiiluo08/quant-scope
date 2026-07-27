# QuantScope

QuantScope is a quantitative trading research platform built with Python and machine learning.

It is designed to progress from market data to factors, strategies, backtesting, and performance analysis.

## What This Repository Contains

- Market data ingestion and processing
- Factor and label creation
- Strategy development and backtesting
- Future-return prediction model training
- Result visualization through a dashboard and AWS deployment

## Repository Structure

- `backend/` - FastAPI backend and API routes
- `frontend/` - React dashboard
- `ml/` - Factor, label, backtesting, and model training code
- `data_pipeline/` - Data ingestion, normalization, and S3 synchronization
- `infra/` - AWS deployment notes and configuration
- `scripts/` - Local development and maintenance helper scripts
- `notebooks/` - Research and learning notebooks
- `tests/` - Tests for the pipeline and core logic
- `data/` - Local raw and processed data
- `docs/` - Scope, plans, schemas, and reviews

## Main Documentation

- [Project Scope](docs/project_scope.md)

## Local Setup

```bash
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python -m ipykernel install --user --name alphaforge
jupyter notebook
```

## Progress

### Week 1 — Quant Foundations and Repository Setup

Status: Completed / In progress

Deliverables:

- Project scope
- Market data basics notebook
- Quant notes
- Data schema draft

### Week 2 — Data Pipeline

Status: Core functionality is complete; the data universe still needs expansion.

Deliverables:

- Downloader: `data_pipeline/ingestion/download.py`
- OHLCV normalization and Parquet I/O: `data_pipeline/processing/normalize.py`
- S3 synchronization utility: `data_pipeline/storage/s3_client.py`
- Market data API: `backend/app/api/routes_market_data.py`
- [Data Quality Report](docs/data_quality_week2.md)
- [Week 2 Review](docs/week2_review.md)

Note: The current processed snapshot contains two tickers (`AAPL` and `SPY`); the Day 14 requirement of at least five tickers remains open.

### Week 3 — Factor Engine

Status: Completed.

Deliverables:

- Universe rebuild job: `data_pipeline/jobs/rebuild_universe.py`
- Factor modules and registry: `ml/factors/`
- Factor storage: `ml/factors/storage.py`
- Factor API: `backend/app/api/routes_factors.py`
- [Factor report](docs/factor_report_week3.md)
- [Week 3 review](docs/week3_review.md)

### Week 4 — Backtesting Engine

Status: Completed.

Deliverables:
- Backtest contracts/engine/metrics: `ml/backtesting/`
- Baseline strategies: `ml/strategies/`
- Batch runner: `data_pipeline/jobs/run_backtests.py`
- Result API: `backend/app/api/routes_backtests.py`
- [Methodology](docs/backtest_methodology_week4.md)
- [Backtest report](docs/backtest_report_week4.md)
- [Week 4 review](docs/week4_review.md)


