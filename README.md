# QuantScope

QuantScope là một nền tảng nghiên cứu giao dịch định lượng dùng Python và Machine Learning.

Nó được thiết kế để đi từ dữ liệu thị trường đến factor, chiến lược, backtest và phân tích hiệu suất.

## Repo này có gì

- Thu thập và xử lý dữ liệu thị trường
- Tạo factor và label
- Xây dựng strategy và backtest
- Huấn luyện model dự đoán return tương lai
- Hiển thị kết quả qua dashboard và AWS deployment

## Cấu trúc thư mục

- `backend/` - FastAPI backend và API
- `frontend/` - Dashboard React
- `ml/` - Factor, label, backtest, training code
- `data_pipeline/` - Ingestion, normalization, S3 sync
- `infra/` - AWS deployment notes và config
- `scripts/` - Script hỗ trợ local dev và maintenance
- `notebooks/` - Notebook nghiên cứu và học tập
- `tests/` - Test cho pipeline và logic chính
- `data/` - Dữ liệu local, raw/processed
- `docs/` - Scope, kế hoạch, schema và review

## Tài liệu chính

- [Project scope](docs/project_scope.md)

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

### Week 1 — Quant foundations + repo setup

Status: Completed / In progress

Deliverables:
- Project scope
- Market data basics notebook
- Quant notes
- Data schema draft

### Week 2 — Data Pipeline

Status: Core functionality complete; the data universe still needs expansion.

Deliverables:
- Downloader: `data_pipeline/ingestion/download.py`
- OHLCV normalization and Parquet I/O: `data_pipeline/processing/normalize.py`
- S3 sync utility: `data_pipeline/storage/s3_client.py`
- Market data API: `backend/app/api/routes_market_data.py`
- [Data quality report](docs/data_quality_week2.md)
- [Week 2 review](docs/week2_review.md)

Note: The current processed snapshot contains 2 tickers (`AAPL`, `SPY`); the Day 14 criterion of at least 5 tickers remains open.
