# QuantScope

> Educational quantitative-research platform. Not investment advice.

## Problem and outcome

QuantScope is an end-to-end quantitative trading research platform built for educational purposes. It solves the problem of organizing financial research by providing a unified pipeline to ingest market data, generate causal factors, backtest rule-based and ML strategies, and visualize results on a deployed web dashboard.

## Demo and screenshots

- **Live Dashboard:** [http://quantscope-frontend-dev-942852434802-aps1.s3-website-ap-southeast-1.amazonaws.com](http://quantscope-frontend-dev-942852434802-aps1.s3-website-ap-southeast-1.amazonaws.com)
- **Live API Endpoint:** [http://ec2-18-143-135-216.ap-southeast-1.compute.amazonaws.com:8000/health](http://ec2-18-143-135-216.ap-southeast-1.compute.amazonaws.com:8000/health)
- **Visual Evidence:** See [docs/screenshots/README.md](docs/screenshots/README.md) (To be finalized).
- **Demo Script:** See [docs/final_demo_script.md](docs/final_demo_script.md) (To be finalized).

## Research flow

Market data → causal factors → rule-based backtest → leakage-controlled ML → dashboard → AWS deployment.

## Features

- **Market Data Ingestion:** Automated pipeline syncing OHLCV data to an S3 Data Lake.
- **Factor Engine:** Extensible engine calculating causal factors (e.g., momentum, volatility).
- **Rule-Based Backtesting:** Engine executing trades with configurable transaction costs and slippage.
- **Machine Learning Lab:** Leakage-controlled time splits training LightGBM/XGBoost models for top-k asset ranking.
- **Research Dashboard:** React + Vite SPA visualizing factors, backtests, and ML predictions.

## Architecture

The system utilizes a hybrid local/cloud architecture:
- Data is periodically ingested via AWS EventBridge and Lambda to a private S3 bucket.
- The backend API runs as a Docker container on an Amazon EC2 instance.
- The frontend is compiled as a static Vite site and hosted on a public S3 bucket.
- See detailed architecture documentation in [docs/architecture.md](docs/architecture.md) and [docs/deployment_aws.md](docs/deployment_aws.md).

## Technology and AWS services

- **Core Tech:** Python 3.12, FastAPI, Pandas, LightGBM, React, Vite, TypeScript, Docker.
- **Testing:** Pytest, Vitest.
- **AWS Services Used:**
  - **S3:** Private data lake & Public static frontend hosting.
  - **EC2 (t3.micro):** FastAPI backend container host.
  - **Lambda & EventBridge:** Scheduled serverless data ingestion.
  - **IAM & CloudWatch:** Least-privilege roles, instance profiles, and 7-day log retention.

## Local setup

```bash
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python -m ipykernel install --user --name quantscope
```

## Verification commands

All deployment claims and functionality are verified through reproducible scripts:
- Local tests: `pytest -q`
- Frontend build: `cd frontend && npm run test && npm run build`
- Docker verification: `docker build -f backend/Dockerfile -t quantscope-api:final .`
- See full E2E checklist at [docs/e2e_checklist.md](docs/e2e_checklist.md).
- See detailed execution records at [docs/week8_verification.md](docs/week8_verification.md).

## Deployment and cost controls

- Cloud deployment includes an AWS Budget alert ($20 / $50 / $100).
- Automatic teardown and cost control runbook available via `./scripts/stop_ec2.sh`.
- Review AWS deployment details at [docs/deployment_aws.md](docs/deployment_aws.md).

## Research limitations

- **No Investment Advice:** Historical backtests and model predictions do not constitute investment advice.
- **Data Bias:** Historical market data (via yfinance) inherently suffers from survivorship bias.
- **Static Universe:** The current universe uses a static list of symbols, failing to account for index additions/deletions.
- **Execution Model:** PnL is modeled assuming signal at $t$ and execution at $t+1$ with static transaction costs (5 bps) and slippage. Real-world execution may vary.

## Repository map

- `backend/` - FastAPI backend and API routes
- `frontend/` - React dashboard
- `ml/` - Factor, label, backtesting, and model training code
- `data_pipeline/` - Data ingestion, normalization, and S3 synchronization
- `infra/` - AWS deployment scripts and IAM policies
- `scripts/` - Local development and maintenance helper scripts
- `tests/` - Pytest suites for pipeline and core logic
- `docs/` - Scope, plans, reports, and architecture diagrams

## Roadmap/status

**Status: QuantScope MVP Completed.**

**Weekly Reviews & Reports:**
- [Week 1 Review](docs/week1_review.md)
- [Week 2 Review](docs/week2_review.md)
- [Week 3 Review](docs/week3_review.md)
- [Week 4 Review](docs/week4_review.md)
- [Week 5 Review](docs/week5_review.md)
- [Week 6 Review](docs/week6_review.md)
- [Week 7 Review](docs/week7_review.md)

**Final Artifacts:**
- [Final Technical Report](docs/final_report.md) (To be finalized).
