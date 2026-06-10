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
