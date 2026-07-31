# QuantScope

> Educational quantitative-research platform. Not investment advice.

## Problem and outcome

QuantScope is an end-to-end quantitative trading research platform built for educational purposes. It solves the problem of organizing financial research by providing a unified pipeline to ingest market data, generate causal factors, backtest rule-based and ML strategies, and visualize results on a deployed web dashboard.

## Demo and screenshots

- **Live Dashboard:** Deployed on AWS Amplify.
- **Live API Endpoint:** Deployed via AWS API Gateway & Lambda.
- **Architecture Diagram:** See [ArchitureDiagram_fn.drawio.png](ArchitureDiagram_fn.drawio.png).

## Research flow

Market data → causal factors → rule-based backtest → leakage-controlled ML → dashboard → AWS deployment.

## Features

- **Market Data Ingestion:** Automated pipeline syncing daily OHLCV data from `yfinance` to an S3 Data Lake in Parquet format with automated data quality gates.
- **Factor Engine:** Extensible engine calculating causal factors (technical indicators including RSI, MACD, Bollinger Bands, Momentum, Volatility, and Volume) without lookahead bias.
- **Rule-Based Backtesting:** Vectorized and event-driven backtesting engine executing strategies (e.g., Momentum, RSI Reversion) with configurable transaction costs (5 bps) and slippage (5 bps).
- **Machine Learning Lab:** Time-series split (leakage-controlled) training LightGBM and XGBoost models for predicting 5-day forward returns and asset ranking.
- **Research Dashboard:** Modern React + Vite + TypeScript SPA visualizing factors, backtests, equity curves/drawdowns, and ML predictions.

## Architecture

The system utilizes a 100% Serverless architecture defined via Terraform:
- The frontend is a React + Vite + TypeScript SPA hosted globally via AWS Amplify.
- The backend API runs as a containerized FastAPI application on AWS Lambda behind Amazon API Gateway (using Mangum).
- Heavy compute tasks (data ingestion, factor calculation, backtesting, and ML model training) run as scheduled containerized tasks on Amazon ECS (Fargate).
- Data and artifacts (Parquet market data, factor tables, backtest outputs, model binaries) are stored in a private Amazon S3 Data Lake.
- Event scheduling is managed by Amazon EventBridge (daily pipeline & weekly ML retraining).
- Unified Docker container image stored in Amazon ECR.
- Consolidated monitoring via Amazon CloudWatch Logs (7-day retention) and least-privilege IAM execution roles.
- See detailed architecture documentation in [docs/deployment_aws.md](docs/deployment_aws.md).

## Technology and AWS services

- **Core Tech:** Python 3.12, FastAPI, Mangum, Pandas, Polars, PyArrow, NumPy, LightGBM, XGBoost, Scikit-learn, React 19, Vite, TypeScript, Lucide React, Recharts, TailwindCSS, Docker.
- **Testing:** Pytest (Backend/ML/Data Pipeline), Vitest (Frontend).
- **AWS Services Used (Serverless):**
  - **AWS Amplify:** Fully managed CI/CD and hosting for the Frontend React SPA.
  - **AWS Lambda & API Gateway:** Serverless REST API serving inferences, factors, backtests, and market data.
  - **Amazon ECS (Fargate):** Heavy-lifting compute for ML Training, factor generation, and backtesting.
  - **Amazon EventBridge:** Scheduler triggering daily automated jobs and weekly model re-training.
  - **Amazon S3:** Private Data Lake storing market data, factor values, and ML models.
  - **Amazon ECR:** Docker container registry for Backend API and ECS Jobs.
  - **IAM & CloudWatch:** Least-privilege roles, active budget alerts, and 7-day log retention.

## Local setup

```bash
# Clone repository and create a Python virtual environment
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

# Install backend & ML dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install
cd ..

# Optional: Register Jupyter kernel for notebooks
python -m ipykernel install --user --name quantscope
```

## Verification commands

All deployment claims and functionality are verified through reproducible scripts:
- Local tests: `pytest -q`
- Frontend tests & build: `cd frontend && npm run test && npm run build`
- Docker verification: `docker build -f backend/Dockerfile -t quantscope-api:final .`
- See full E2E checklist at [docs/e2e_checklist.md](docs/e2e_checklist.md).
- See detailed execution records at [docs/week8_verification.md](docs/week8_verification.md).

## Deployment and cost controls

- Infrastructure is fully defined using Infrastructure as Code (Terraform) in [infra/terraform](infra/terraform).
- 100% Serverless architecture ensures pay-as-you-go pricing with zero cost when idle (no persistent EC2 instances).
- Heavy jobs (ML training & backtesting) are scheduled to run briefly on-demand and automatically terminate via ECS Fargate.
- Log retention is capped at 7 days in CloudWatch Logs, and AWS Budget alerts ($20/$50/$100) are configured.
- Review AWS deployment details at [docs/deployment_aws.md](docs/deployment_aws.md).

## Research limitations

- **No Investment Advice:** Historical backtests and model predictions do not constitute investment advice.
- **Data Bias:** Historical market data (via `yfinance`) inherently suffers from survivorship bias.
- **Static Universe:** The current universe uses a static list of symbols, failing to account for index additions/deletions.
- **Execution Model:** PnL is modeled assuming signal at $t$ and execution at $t+1$ with static transaction costs (5 bps) and slippage (5 bps). Real-world execution may vary.

## Repository map

- `backend/` - FastAPI backend, routes, schemas, service layer, and Lambda entry point
- `data/` - Local storage directory for raw and processed Parquet market data files
- `data_pipeline/` - Data ingestion, normalization, quality gate validation, and S3 sync jobs
- `docs/` - Scope, plans, reports, E2E checklists, and architecture documentation
- `frontend/` - React + Vite + TypeScript dashboard SPA (Market Data, Factors, Backtests, ML Lab)
- `infra/` - Terraform Infrastructure-as-Code for AWS Serverless architecture and IAM policies
- `ml/` - Factor calculation, strategy rules, backtesting engine, and ML model training (LightGBM/XGBoost)
- `notebooks/` - Jupyter notebooks for quantitative data analysis and experimentation
- `scripts/` - Helper scripts for API Gateway, S3 sync, ECS job triggers, and backend deployment
- `tests/` - Pytest test suite covering data pipeline, factors, backtests, ML models, and API endpoints

## Roadmap/status

**Status: QuantScope MVP Completed.**

**Weekly Reviews & Reports:**
- [Week 1 Review](docs/week1_review.md) - Project Setup & Architecture
- [Week 2 Review](docs/week2_review.md) - Data Pipeline & Quality Gate
- [Week 3 Review](docs/week3_review.md) - Factor Calculation Engine
- [Week 4 Review](docs/week4_review.md) - Rule-Based Backtesting Engine
- [Week 5 Review](docs/week5_review.md) - Leakage-Controlled ML Lab
- [Week 6 Review](docs/week6_review.md) - React Dashboard Walkthrough
- [Week 7 Review](docs/week7_review.md) - AWS Serverless Architecture & Terraform
- [Week 8 Review](docs/week8_verification.md) - E2E Verification Record

**Final Artifacts & Guides:**
- [AWS Deployment Guide](docs/deployment_aws.md)
- [End-to-End Checklist](docs/e2e_checklist.md)
