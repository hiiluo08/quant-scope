# QuantScope — 8-week AI-Powered Quant Research Platform Roadmap

## Context

Bạn là sinh viên CNTT đã có nền tảng Python, C++, Machine Learning, Deep Learning, FastAPI, database, Docker và AWS cơ bản, nhưng gần như chưa có kiến thức Quantitative Finance/Quantitative Trading. Mục tiêu là học Quant bằng cách xây dựng sản phẩm thực tế trong 8 tuần: **QuantScope — AI-Powered Quant Research Platform**.

Kế hoạch này ưu tiên:

- Hoàn thành được trong 8 tuần hơn là làm kiến trúc quá hoành tráng.
- Dùng tối thiểu 3 dịch vụ AWS theo yêu cầu môn học.
- Tối ưu chi phí trong khoảng ~$200 AWS credits.
- Tránh EKS, SageMaker endpoint chạy liên tục, OpenSearch, RDS nếu không thật sự cần.
- Xây sản phẩm đủ tốt để đưa vào CV/GitHub Portfolio.

> Lưu ý: Đây là dự án giáo dục/nghiên cứu, không phải lời khuyên đầu tư. Không nên dùng để giao dịch tiền thật.

---

# Phần 1 — Roadmap tổng thể 8 tuần

## Tầm nhìn sản phẩm

QuantScope là nền tảng nghiên cứu alpha đơn giản nhưng có chiều sâu:

1. Thu thập dữ liệu giá cổ phiếu/ETF.
2. Lưu dữ liệu dạng data lake trên S3.
3. Tính toán factor định lượng.
4. Xây chiến lược giao dịch dựa trên rule và factor.
5. Backtest với phí giao dịch/slippage cơ bản.
6. Phân tích hiệu suất: CAGR, Sharpe, drawdown, win rate, exposure, turnover.
7. Huấn luyện mô hình ML dự đoán alpha/return tương lai.
8. Trực quan hóa bằng dashboard.
9. Deploy backend/frontend lên AWS với chi phí thấp.

## MVP bắt buộc hoàn thành

Nếu chỉ có thời gian cho MVP, phải có:

- Data ingestion cho 30–100 tickers.
- Lưu raw/processed data vào S3.
- Backend FastAPI có API đọc market data, factors, backtest results.
- Ít nhất 5 factors: momentum, volatility, RSI, moving average ratio, volume z-score.
- Ít nhất 2 strategies: momentum long-only, ML score ranking.
- Backtest vectorized với transaction cost.
- ML model XGBoost hoặc LightGBM dự đoán forward return.
- Dashboard React hiển thị data, factor, backtest, ML metrics.
- Deploy AWS dùng tối thiểu: S3, Lambda, EC2. EventBridge/CloudWatch/IAM dùng hỗ trợ.

## Roadmap theo tuần

| Tuần | Chủ đề | Mục tiêu chính | Deliverable lớn |
|---|---|---|---|
| Week 1 | Quant foundations + repo setup | Hiểu dữ liệu OHLCV, returns, factor, backtest; setup monorepo | Repo chuẩn, data schema, notebook đầu tiên |
| Week 2 | Data pipeline | Ingest dữ liệu, chuẩn hóa, lưu S3/SQLite | Data pipeline chạy local + S3, API data cơ bản |
| Week 3 | Factor engine | Tạo và quản lý factors | Factor registry, 5–8 factors, factor API |
| Week 4 | Backtesting engine | Xây backtest rule-based | Backtest momentum/mean-reversion, metrics report |
| Week 5 | ML alpha prediction | Tạo labels, train XGBoost/LightGBM, tránh leakage | ML pipeline, model artifact, prediction API |
| Week 6 | Dashboard | Giao diện nghiên cứu và phân tích hiệu suất | React dashboard usable, charts, comparison views |
| Week 7 | AWS deployment | Deploy cost-optimized architecture | EC2 app, Lambda ingestion, S3 artifacts, monitoring |
| Week 8 | Polish portfolio | Hoàn thiện docs, demo, testing, GitHub profile | README xịn, architecture diagram, demo video, final report |

---

# Phần 2 — Kế hoạch theo ngày

Giả định thời lượng: **2–4 giờ/ngày**, 6–7 ngày/tuần. Nếu bận, ưu tiên các ngày có nhãn **Core**.

## Week 1 — Quant foundations + project setup

| Ngày | Nhiệm vụ | Mục tiêu | Thời lượng | Deliverable |
|---|---|---|---:|---|
| Day 1 — Core | Khởi tạo repo, đọc tổng quan Quant Trading | Hiểu QuantScope sẽ làm gì và không làm gì | 3h | Repo skeleton, README draft, project scope |
| Day 2 — Core | Học OHLCV, adjusted close, return, log return | Biết dữ liệu thị trường cơ bản | 3h | Notebook `01_market_data_basics.ipynb` |
| Day 3 — Core | Học factor, alpha, signal, label | Hiểu factor khác ML feature như thế nào | 3h | Notes: factor taxonomy, target label definition |
| Day 4 | Setup Python env, Docker, Makefile/scripts | Chuẩn hóa môi trường dev | 2–3h | `requirements.txt`/`pyproject.toml`, Dockerfile draft |
| Day 5 — Core | Thử tải dữ liệu bằng yfinance/Stooq | Có data mẫu 5 tickers | 3h | CSV/Parquet local, notebook ingest demo |
| Day 6 | Thiết kế schema dữ liệu | Chuẩn hóa raw/processed schema | 2h | `docs/data_schema.md` |
| Day 7 | Weekly review + GitHub cleanup | Chốt milestone tuần 1 | 2h | README updated, Week 1 commit summary |

### Tiêu chí hoàn thành Week 1

- Có repo rõ ràng.
- Chạy được notebook tải dữ liệu.
- Hiểu: return, adjusted price, signal, alpha, factor, backtest.
- Có tài liệu giải thích scope dự án.

---

## Week 2 — Data pipeline

| Ngày | Nhiệm vụ | Mục tiêu | Thời lượng | Deliverable |
|---|---|---|---:|---|
| Day 8 — Core | Viết module data downloader | Tách code khỏi notebook | 3h | `data_pipeline/ingestion/download.py` |
| Day 9 — Core | Chuẩn hóa OHLCV thành Parquet | Dữ liệu lưu hiệu quả | 3h | `data_pipeline/processing/normalize.py` |
| Day 10 | Tạo local storage layout | Quy ước partition theo symbol/date | 2h | `data/raw`, `data/processed` hoặc `.gitignore` |
| Day 11 — Core | Setup S3 bucket dev | Lưu data lake trên AWS | 2–3h | S3 bucket, upload script |
| Day 12 — Core | Viết S3 sync utility | Push/pull parquet giữa local và S3 | 3h | `data_pipeline/storage/s3_client.py` |
| Day 13 | FastAPI data endpoints | API đọc symbols, date range, OHLCV | 3h | `/api/v1/market-data/*` |
| Day 14 | Weekly review + data quality checks | Kiểm tra missing, duplicate, timezone | 2–3h | Data validation report |

### Tiêu chí hoàn thành Week 2

- Ingest được 30–100 tickers.
- Data lưu dạng Parquet.
- Có S3 data lake.
- FastAPI trả dữ liệu market data cơ bản.

---

## Week 3 — Factor engine

| Ngày | Nhiệm vụ | Mục tiêu | Thời lượng | Deliverable |
|---|---|---|---:|---|
| Day 15 — Core | Thiết kế factor interface | Mỗi factor có name, params, compute | 3h | `ml/factors/base.py` hoặc `backend/app/factors/base.py` |
| Day 16 — Core | Implement momentum factors | Tín hiệu xu hướng | 3h | `momentum_20d`, `momentum_60d` |
| Day 17 — Core | Implement volatility + volume factors | Đo risk/attention | 3h | `volatility_20d`, `volume_zscore_20d` |
| Day 18 | Implement RSI/SMA ratio | Factor kỹ thuật phổ biến | 3h | `rsi_14`, `sma_ratio_20_50` |
| Day 19 — Core | Factor registry + caching | Quản lý factor tập trung | 3h | Factor registry, factor parquet output |
| Day 20 | Factor API endpoints | Dashboard đọc được factors | 2–3h | `/api/v1/factors`, `/api/v1/factors/{name}` |
| Day 21 | Weekly review + factor plots | Kiểm tra phân phối factor | 2–3h | Notebook factor EDA |

### Tiêu chí hoàn thành Week 3

- Có ít nhất 5 factors chạy được.
- Có registry để thêm factor mới dễ dàng.
- Có API trả factor values.
- Có biểu đồ phân phối/correlation factor.

---

## Week 4 — Backtesting engine

| Ngày | Nhiệm vụ | Mục tiêu | Thời lượng | Deliverable |
|---|---|---|---:|---|
| Day 22 — Core | Học backtest basics | Hiểu signal, position, PnL, cost | 3h | Notes: backtest assumptions |
| Day 23 — Core | Implement vectorized backtest | Backtest nhanh trên pandas/vectorbt | 4h | `ml/backtesting/engine.py` |
| Day 24 — Core | Metrics: CAGR, Sharpe, MDD | Đánh giá chiến lược | 3h | `ml/backtesting/metrics.py` |
| Day 25 | Strategy 1: momentum long-only | Chiến lược baseline | 3h | `strategies/momentum.py` |
| Day 26 | Strategy 2: mean reversion/RSI | So sánh phong cách signal | 3h | `strategies/rsi_reversion.py` |
| Day 27 — Core | Backtest API + result storage | Lưu kết quả để dashboard đọc | 3h | `/api/v1/backtests` |
| Day 28 | Weekly review + report | Có backtest report hoàn chỉnh | 3h | `docs/backtest_report_week4.md` |

### Tiêu chí hoàn thành Week 4

- Có 2 chiến lược rule-based.
- Có transaction cost/slippage giả lập.
- Có metrics đầy đủ.
- Có report giải thích kết quả, không chỉ screenshot.

---

## Week 5 — ML alpha prediction

| Ngày | Nhiệm vụ | Mục tiêu | Thời lượng | Deliverable |
|---|---|---|---:|---|
| Day 29 — Core | Học ML pitfalls trong finance | Tránh leakage, random split sai | 3h | Notes: finance ML checklist |
| Day 30 — Core | Tạo label forward return | Target dự đoán return tương lai | 3h | `ml/features/labels.py` |
| Day 31 — Core | Feature matrix từ factors | X, y, date, symbol chuẩn | 3h | `ml/features/build_dataset.py` |
| Day 32 — Core | Time-series split/walk-forward | Đánh giá thực tế hơn | 4h | `ml/training/split.py` |
| Day 33 — Core | Train XGBoost/LightGBM | Model alpha baseline | 4h | `ml/training/train.py`, model artifact |
| Day 34 | Prediction + ranking strategy | Dùng ML score để chọn top assets | 3h | `strategies/ml_ranker.py` |
| Day 35 | Weekly review + ML report | So sánh ML vs rule-based | 3h | `docs/ml_report_week5.md` |

### Tiêu chí hoàn thành Week 5

- Có label đúng thời gian, không leakage.
- Có train/test split theo thời gian.
- Có model artifact lưu S3/local.
- Có backtest chiến lược ML ranking.

---

## Week 6 — Dashboard

| Ngày | Nhiệm vụ | Mục tiêu | Thời lượng | Deliverable |
|---|---|---|---:|---|
| Day 36 — Core | Setup React/Vite + UI library | Frontend nhẹ, rẻ để deploy S3 | 2–3h | `frontend/` scaffold |
| Day 37 — Core | Market data page | Xem giá/volume từng symbol | 3h | Candlestick/line chart |
| Day 38 — Core | Factor explorer page | Xem factor distribution/correlation | 4h | Factor charts |
| Day 39 — Core | Backtest results page | Equity curve, drawdown, metrics | 4h | Backtest dashboard |
| Day 40 | ML lab page | Xem feature importance, predictions | 3h | ML dashboard |
| Day 41 | API integration + loading/error states | UX ổn định | 3h | Frontend gọi FastAPI ổn định |
| Day 42 | Weekly review + demo flow | Có demo 5–7 phút | 3h | Demo script draft |

### Tiêu chí hoàn thành Week 6

- Dashboard chạy local.
- Người xem hiểu được data → factor → backtest → ML.
- Có loading/error states cơ bản.
- Có ít nhất 4 trang: Overview, Factors, Backtests, ML Lab.

---

## Week 7 — AWS deployment

| Ngày | Nhiệm vụ | Mục tiêu | Thời lượng | Deliverable |
|---|---|---|---:|---|
| Day 43 — Core | Thiết kế IAM least privilege | Không dùng root, không cấp quá rộng | 2–3h | IAM user/role policy notes |
| Day 44 — Core | Deploy S3 data lake + frontend static | Frontend/data trên S3 | 3h | S3 buckets configured |
| Day 45 — Core | Deploy EC2 FastAPI Docker | Backend chạy public demo | 4h | EC2 + Docker + FastAPI |
| Day 46 — Core | Lambda scheduled ingestion | Data update tự động | 4h | Lambda function + S3 write |
| Day 47 | EventBridge + CloudWatch logs | Schedule + monitor tối thiểu | 3h | Daily/weekly trigger, logs |
| Day 48 | Security/cost hardening | Budget alarm, stop script, CORS, ports | 3h | AWS budget, security group clean |
| Day 49 | Weekly review + deploy docs | Người khác có thể reproduce | 3h | `docs/deployment_aws.md` |

### Tiêu chí hoàn thành Week 7

- Dùng ít nhất 3 AWS services: S3, Lambda, EC2.
- Có thể mở dashboard/backend demo.
- Có CloudWatch logs và AWS Budget alert.
- Biết cách tắt EC2 để tránh tốn credits.

---

## Week 8 — Polish, portfolio, final report

| Ngày | Nhiệm vụ | Mục tiêu | Thời lượng | Deliverable |
|---|---|---|---:|---|
| Day 50 — Core | End-to-end testing | Kiểm tra flow từ data đến dashboard | 4h | E2E checklist |
| Day 51 — Core | Improve README portfolio | GitHub nhìn chuyên nghiệp | 4h | README final |
| Day 52 | Add architecture diagrams | Người xem hiểu system nhanh | 3h | ASCII + image diagram |
| Day 53 | Add screenshots/demo video | Tăng giá trị CV | 3h | `/docs/screenshots`, demo video |
| Day 54 — Core | Final technical report | Giải thích quant + ML + AWS | 4h | `docs/final_report.md` |
| Day 55 | Cleanup code/tests | Chạy lint/test, bỏ code thừa | 3h | Clean repo |
| Day 56 — Core | Final presentation rehearsal | Chuẩn bị bảo vệ/demo | 3h | Slide/demo script |

### Tiêu chí hoàn thành Week 8

- README có problem, architecture, features, setup, AWS cost, screenshots.
- Demo chạy được.
- Có final report giải thích quyết định kỹ thuật.
- Có checklist rủi ro và giới hạn mô hình.

---

# Phần 3 — Kiến thức Quant cần học theo giai đoạn

## Week 1: Market data basics

Chỉ học đủ để code:

- OHLCV: Open, High, Low, Close, Volume.
- Adjusted Close: giá đã điều chỉnh cổ tức/split.
- Return: `r_t = price_t / price_{t-1} - 1`.
- Log return: `log(price_t / price_{t-1})`.
- Missing data, trading calendar, survivorship bias.

Không cần học sâu:

- Derivatives pricing.
- Fixed income.
- Market microstructure chuyên sâu.

## Week 2–3: Factors

Cần học:

- Factor là tín hiệu định lượng có thể dự đoán return/risk.
- Technical factors: momentum, RSI, moving average.
- Risk factors: volatility, beta cơ bản.
- Cross-sectional ranking: xếp hạng nhiều tài sản tại cùng ngày.
- Z-score/normalization.

Công thức cần nắm:

- Momentum N ngày: `close_t / close_{t-N} - 1`.
- Volatility N ngày: std của daily returns.
- RSI 14 ngày.
- SMA ratio: `SMA_short / SMA_long - 1`.
- Volume z-score: `(volume - rolling_mean) / rolling_std`.

## Week 4: Backtesting

Cần học:

- Signal vs position.
- Entry/exit rule.
- Position sizing đơn giản.
- Transaction cost.
- Slippage giả lập.
- Look-ahead bias: dùng dữ liệu tương lai là sai.
- Metrics: CAGR, Sharpe, Sortino, Max Drawdown, Calmar, turnover.

Quy tắc quan trọng:

- Signal tính tại ngày `t` chỉ được trade ở `t+1`.
- Không random split dữ liệu thời gian.
- Luôn so sánh với benchmark như SPY hoặc equal-weight.

## Week 5: ML trong tài chính

Cần học:

- Label forward return: return trong 5/10/20 ngày tới.
- Classification vs regression:
  - Regression: dự đoán forward return.
  - Classification: dự đoán up/down hoặc top quantile.
- Walk-forward validation.
- Feature leakage.
- Non-stationarity: thị trường thay đổi theo thời gian.
- Feature importance chỉ là gợi ý, không phải bằng chứng alpha chắc chắn.

Không cần học sâu:

- Reinforcement Learning trading.
- HFT.
- Deep Learning sequence model phức tạp.
- Portfolio optimization nâng cao.

## Week 6–8: Productizing Quant

Cần học:

- Data quality monitoring.
- Reproducible research.
- Model artifact/versioning.
- Cost-aware cloud deployment.
- Giải thích giới hạn mô hình trong README/report.

---

# Phần 4 — System Architecture

## 4.1 Data Flow

```text
              +-----------------------------+
              | Public Market Data Sources  |
              | yfinance / Stooq / CSV      |
              +--------------+--------------+
                             |
                             v
+------------------+   +-----+------+   +-------------------------+
| Local Dev Script |-->| Lambda     |-->| S3 Data Lake            |
| or Manual Job    |   | Ingestion  |   | raw/processed Parquet   |
+------------------+   +-----+------+   +------------+------------+
                             |                       |
                             | CloudWatch Logs       |
                             v                       v
                       +-----+------+       +--------+---------+
                       | EventBridge|       | Factor Engine    |
                       | Schedule   |       | pandas/numpy     |
                       +------------+       +--------+---------+
                                                   |
                                                   v
                                         +---------+----------+
                                         | Backtest Engine    |
                                         | vectorbt/pandas    |
                                         +---------+----------+
                                                   |
                                                   v
                                         +---------+----------+
                                         | Result Store       |
                                         | SQLite + S3 JSON   |
                                         +---------+----------+
                                                   |
                                                   v
                                         +---------+----------+
                                         | FastAPI Backend    |
                                         | EC2 Docker         |
                                         +---------+----------+
                                                   |
                                                   v
                                         +---------+----------+
                                         | React Dashboard    |
                                         | S3 static or EC2   |
                                         +--------------------+
```

## 4.2 ML Pipeline

```text
+-------------------+
| Processed OHLCV   |
| S3 Parquet        |
+---------+---------+
          |
          v
+---------+---------+
| Factor Computation|
| momentum, RSI,... |
+---------+---------+
          |
          v
+---------+---------+
| Label Builder     |
| forward return    |
| horizon 5/10/20d  |
+---------+---------+
          |
          v
+---------+---------+
| Dataset Builder   |
| X, y, date, symbol|
+---------+---------+
          |
          v
+---------+---------+
| Time Split        |
| train/valid/test  |
| walk-forward      |
+---------+---------+
          |
          v
+---------+---------+        +------------------+
| XGBoost/LightGBM  |------->| Model Artifact   |
| Training          |        | S3/local .pkl    |
+---------+---------+        +------------------+
          |
          v
+---------+---------+
| Prediction Scores |
| rank symbols      |
+---------+---------+
          |
          v
+---------+---------+
| ML Strategy       |
| top-k long-only   |
+---------+---------+
          |
          v
+---------+---------+
| Backtest Report   |
| metrics + charts  |
+-------------------+
```

## 4.3 AWS Architecture

```text
                                 AWS Account
+---------------------------------------------------------------------+
|                                                                     |
|  +------------------+        +-------------------+                  |
|  | EventBridge      |------->| Lambda Ingestion  |                  |
|  | daily schedule   |        | fetch OHLCV       |                  |
|  +------------------+        +---------+---------+                  |
|                                      |                              |
|                                      v                              |
|                           +----------+-----------+                  |
|                           | S3 Bucket            |                  |
|                           | alphaforge-data      |                  |
|                           | raw/processed/models |                  |
|                           +----------+-----------+                  |
|                                      ^                              |
|                                      |                              |
|  +------------------+        +-------+-------------------+          |
|  | CloudWatch Logs  |<-------| EC2 t3/t4g micro/small    |          |
|  | logs/metrics     |        | Docker Compose            |          |
|  +------------------+        | FastAPI + SQLite + Nginx  |          |
|                              +-------+-------------------+          |
|                                      |                              |
|                                      v                              |
|                           +----------+-----------+                  |
|                           | React Dashboard      |                  |
|                           | Option A: S3 static  |                  |
|                           | Option B: EC2 Nginx  |                  |
|                           +----------------------+                  |
|                                                                     |
|  +------------------+                                               |
|  | IAM Roles        | Least privilege for EC2/Lambda/S3             |
|  +------------------+                                               |
|                                                                     |
+---------------------------------------------------------------------+
```

### Kiến trúc khuyến nghị

- **Data lake:** S3.
- **Scheduled ingestion:** Lambda + EventBridge.
- **Backend:** FastAPI chạy Docker trên EC2.
- **Metadata/results DB:** SQLite trên EC2 cho MVP.
- **Frontend:** React/Vite build static. Có thể host trên S3 hoặc serve bằng Nginx trên EC2.
- **Monitoring:** CloudWatch logs tối thiểu.
- **Budget guardrail:** AWS Budget alert + dừng EC2 khi không demo.

---

# Phần 5 — AWS Architecture tối ưu chi phí

## Nguyên tắc chi phí

1. Không chạy dịch vụ managed đắt nếu không cần.
2. Không dùng EKS.
3. Không dùng SageMaker Endpoint chạy liên tục.
4. Không dùng OpenSearch.
5. Ưu tiên batch/offline hơn real-time.
6. EC2 chỉ chạy khi cần demo/dev; dừng khi không dùng.
7. S3 lifecycle/delete policy cho dữ liệu thử nghiệm.
8. Thiết lập AWS Budget alert ngay trong Week 7.

## Bảng dịch vụ AWS

| Dịch vụ | Vai trò | Chi phí dự kiến 8 tuần | Lý do chọn | Alternative rẻ hơn? |
|---|---|---:|---|---|
| Amazon S3 | Lưu raw/processed data, model artifacts, backtest reports, optional frontend static | Thường <$1–$5 nếu dữ liệu vài GB | Rẻ, bền, đúng mô hình data lake | Local disk rẻ hơn nhưng không đáp ứng cloud/data lake |
| AWS Lambda | Ingestion job định kỳ, xử lý nhẹ | Gần $0 nếu dưới free tier; sau free tier vẫn rất rẻ | Không cần server chạy liên tục | Cron trên EC2 rẻ nếu EC2 đã chạy, nhưng kém cloud-native hơn |
| Amazon EC2 | Chạy FastAPI backend, SQLite, Nginx/Docker | $0–$30/tháng tùy free tier và loại instance; 8 tuần có thể $0–$60 | Đơn giản, kiểm soát tốt, phù hợp đồ án | Lightsail ~$3.5–$5/tháng dễ dự đoán hơn, nhưng yêu cầu môn học ưu tiên EC2 |
| EventBridge | Schedule Lambda daily/weekly | Gần $0 cho số rule rất nhỏ | Cần để tự động hóa ingestion | Manual trigger rẻ hơn nhưng không chuyên nghiệp |
| CloudWatch Logs | Log Lambda/EC2 tối thiểu | Gần $0 nếu log ít; kiểm soát retention 7 ngày | Debug/deploy evidence | Ghi log local rẻ hơn nhưng thiếu observability AWS |
| IAM | Role/policy least privilege | $0 | Bắt buộc để bảo mật | Không có alternative |
| AWS Budgets | Cảnh báo chi phí | Thường rất thấp/miễn phí cho basic usage | Tránh cháy credits | Theo dõi thủ công rẻ hơn nhưng nguy hiểm |
| RDS PostgreSQL | Không dùng trong MVP; optional DB managed | Có thể ~$20+/tháng cho db.t4g.micro nếu không free tier | Chỉ dùng nếu cần demo managed DB | SQLite/PostgreSQL Docker trên EC2 rẻ hơn |
| CloudFront | Optional CDN cho frontend | Có thể rẻ nhưng thêm complexity | Chỉ cần nếu muốn HTTPS/CDN tốt hơn | Serve frontend bằng EC2/S3 website đơn giản hơn |

## Ước tính chi phí thực tế

### Scenario A — Siêu tiết kiệm, khuyến nghị

- S3: 1–5 GB data → thường <$1/tháng.
- Lambda: vài lần/ngày, memory thấp → gần $0.
- EventBridge: 1–3 schedules → gần $0.
- EC2: chạy khi demo/dev, dừng khi không dùng → $0–$10/tháng nếu free/ít giờ.
- CloudWatch: retention 7 ngày, logs ít → gần $0.

**Tổng 8 tuần ước tính:** ~$5–$25.

### Scenario B — EC2 chạy 24/7

- EC2 t3/t4g micro/small chạy liên tục.
- S3/Lambda/CloudWatch thấp.

**Tổng 8 tuần ước tính:** ~$20–$80 tùy instance/free tier.

### Scenario C — Dùng RDS managed PostgreSQL

- EC2 + RDS + S3 + Lambda.
- RDS có thể ~$20+/tháng nếu không free tier.

**Tổng 8 tuần ước tính:** ~$60–$140.

**Khuyến nghị:** Không dùng RDS cho MVP. Dùng SQLite trước. Nếu muốn thể hiện database skill, dùng PostgreSQL Docker trên EC2 trong giai đoạn demo, nhưng nhớ backup và kiểm soát RAM.

## Chi phí và lưu ý từ nguồn chính thức/cập nhật

- S3 Standard us-east-1 thường khoảng $0.023/GB-month, request rất rẻ, free tier có mức miễn phí nhỏ cho storage/request/data transfer. Nguồn: [AWS S3 pricing](https://aws.amazon.com/s3/pricing/).
- Lambda free tier thường gồm 1M requests/tháng và 400,000 GB-seconds/tháng; sau đó request vẫn rẻ. Nguồn tham khảo: [AWS Lambda pricing](https://aws.amazon.com/lambda/pricing/) và kết quả search pricing.
- EC2 free tier đã thay đổi cho account mới từ 2025; cần kiểm tra account của bạn. Nguồn: [EC2 Free Tier usage](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-free-tier-usage.html), [EC2 FAQ](https://aws.amazon.com/ec2/faqs/), [EC2 On-Demand pricing](https://aws.amazon.com/ec2/pricing/on-demand/).
- CloudWatch cần giới hạn log retention để tránh chi phí log tăng. Nguồn: [CloudWatch Logs billing](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/LogsBillingDetails.html), [CloudWatch billing optimization](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_billing.html).
- RDS PostgreSQL có thể phát sinh chi phí đáng kể nếu không còn free tier. Nguồn: [AWS RDS pricing](https://aws.amazon.com/rds/pricing/), [RDS FAQs](https://aws.amazon.com/rds/faqs/).
- Lightsail là alternative VPS rẻ/dự đoán được, nhưng nếu môn học yêu cầu EC2 thì dùng EC2. Nguồn: [Lightsail pricing](https://aws.amazon.com/lightsail/pricing/).

---

# Phần 6 — Repository Structure

```text
alphaforge/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes_market_data.py
│   │   │   ├── routes_factors.py
│   │   │   ├── routes_backtests.py
│   │   │   └── routes_models.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── logging.py
│   │   ├── db/
│   │   │   ├── models.py
│   │   │   └── session.py
│   │   ├── services/
│   │   │   ├── market_data_service.py
│   │   │   ├── factor_service.py
│   │   │   ├── backtest_service.py
│   │   │   └── model_service.py
│   │   └── main.py
│   ├── tests/
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Overview.tsx
│   │   │   ├── MarketData.tsx
│   │   │   ├── Factors.tsx
│   │   │   ├── Backtests.tsx
│   │   │   └── MLLab.tsx
│   │   ├── components/
│   │   ├── api/
│   │   ├── charts/
│   │   └── App.tsx
│   └── package.json
│
├── ml/
│   ├── factors/
│   │   ├── base.py
│   │   ├── momentum.py
│   │   ├── volatility.py
│   │   ├── technical.py
│   │   └── registry.py
│   ├── features/
│   │   ├── labels.py
│   │   └── build_dataset.py
│   ├── backtesting/
│   │   ├── engine.py
│   │   ├── metrics.py
│   │   └── strategies.py
│   ├── training/
│   │   ├── split.py
│   │   ├── train.py
│   │   └── evaluate.py
│   └── inference/
│       └── predict.py
│
├── data_pipeline/
│   ├── ingestion/
│   │   ├── download.py
│   │   └── lambda_handler.py
│   ├── processing/
│   │   ├── normalize.py
│   │   └── validate.py
│   ├── storage/
│   │   ├── local_store.py
│   │   └── s3_client.py
│   └── jobs/
│       ├── ingest_daily.py
│       └── compute_factors.py
│
├── infra/
│   ├── aws/
│   │   ├── iam_policies/
│   │   ├── lambda/
│   │   ├── ec2_user_data.sh
│   │   └── s3_lifecycle.md
│   ├── docker-compose.yml
│   └── README.md
│
├── notebooks/
│   ├── 01_market_data_basics.ipynb
│   ├── 02_factor_eda.ipynb
│   ├── 03_backtest_analysis.ipynb
│   └── 04_ml_alpha_prediction.ipynb
│
├── docs/
│   ├── architecture.md
│   ├── data_schema.md
│   ├── quant_notes.md
│   ├── aws_cost_plan.md
│   ├── deployment_aws.md
│   ├── final_report.md
│   └── screenshots/
│
├── scripts/
│   ├── run_backend.ps1
│   ├── run_frontend.ps1
│   ├── sync_s3.ps1
│   └── stop_ec2_notes.md
│
├── tests/
├── README.md
├── pyproject.toml
├── .env.example
└── .gitignore
```

## Trách nhiệm từng thư mục

- `backend/`: FastAPI app, API routes, service layer, database session, Dockerfile.
- `frontend/`: React/Vite dashboard, charts, API client, UI components.
- `ml/`: Factors, feature engineering, labels, backtesting, model training/inference.
- `data_pipeline/`: Data ingestion, processing, validation, S3 upload/download, Lambda handler.
- `infra/`: AWS deployment notes/configs, Docker Compose, IAM examples, EC2 setup.
- `docs/`: Tài liệu portfolio: architecture, cost, quant notes, final report.
- `notebooks/`: Exploration/EDA; không chứa business logic chính.
- `scripts/`: Lệnh tiện ích cho local dev/deploy.
- `tests/`: Test shared hoặc integration tests.

---

# Phần 7 — Stack công nghệ đề xuất

## Backend

**Chọn: FastAPI**

Lý do:

- Bạn đã biết FastAPI.
- Dễ viết API cho dashboard.
- Dễ deploy Docker trên EC2.
- Tích hợp Python ML stack tự nhiên.

## Frontend

**Chọn: React + Vite, không chọn Next.js cho MVP**

Lý do:

- Dashboard chủ yếu client-side, không cần SSR.
- Build static dễ host trên S3 hoặc Nginx EC2.
- Rẻ hơn và ít complexity hơn Next.js.
- React đủ để thể hiện frontend skill.

Nếu muốn dùng Next.js:

- Chỉ nên dùng static export hoặc deploy riêng sau khi MVP xong.
- Không nên biến frontend thành trọng tâm dự án.

## Database

**Chọn MVP: SQLite**

Lý do:

- Rẻ nhất.
- Không cần chạy RDS.
- Đủ cho metadata/backtest result của đồ án.
- Dễ backup file DB lên S3.

**Optional upgrade:** PostgreSQL Docker trên EC2 hoặc RDS PostgreSQL.

- PostgreSQL Docker: rẻ hơn RDS nhưng cần tự quản lý.
- RDS: chuyên nghiệp hơn nhưng có nguy cơ tốn credits.

## ML

**Chọn: XGBoost trước, LightGBM optional**

Lý do:

- Mạnh cho tabular data.
- Dễ giải thích feature importance.
- Chạy CPU ổn.
- Không cần GPU/SageMaker.

## Backtesting

**Chọn: vectorbt hoặc pandas vectorized engine**

Lý do:

- Nhanh cho nhiều symbols/factors.
- Hợp với research workflow.
- Dễ visualize.

Nếu bạn thấy vectorbt quá phức tạp:

- Tự viết pandas vectorized backtest tối giản trước.
- Sau đó mới thêm vectorbt.

## Cloud

**Chọn: AWS S3 + Lambda + EC2 + EventBridge + CloudWatch**

Lý do:

- Đáp ứng yêu cầu tối thiểu 3 dịch vụ AWS.
- Chi phí thấp.
- Kiến trúc đủ cloud-native nhưng không enterprise quá mức.

## Data source

Khuyến nghị:

- MVP: yfinance hoặc Stooq cho dữ liệu miễn phí.
- Dataset nhỏ: S&P 100 tickers hoặc 30–50 ETFs/stocks.
- Không dùng paid market data API trong 8 tuần.

---

# Phần 8 — GitHub Milestones

## Week 1 GitHub

Commit nên có:

- `chore: initialize alphaforge repository`
- `docs: add project scope and roadmap`
- `notebook: explore market data basics`
- `docs: add data schema draft`

Phải xuất hiện:

- README draft.
- Repo structure.
- Notebook market data basics.
- `.env.example` và `.gitignore`.

## Week 2 GitHub

Commit nên có:

- `feat(data): add market data downloader`
- `feat(data): normalize ohlcv parquet output`
- `feat(storage): add s3 upload and download utilities`
- `feat(api): add market data endpoints`

Phải xuất hiện:

- Data pipeline code.
- S3 storage docs.
- API endpoint examples.
- Data validation notes.

## Week 3 GitHub

Commit nên có:

- `feat(factors): add factor base interface and registry`
- `feat(factors): implement momentum and volatility factors`
- `feat(factors): add rsi and moving average factors`
- `feat(api): add factor endpoints`

Phải xuất hiện:

- Factor registry.
- Ít nhất 5 factors.
- Notebook factor EDA.
- Docs giải thích factors.

## Week 4 GitHub

Commit nên có:

- `feat(backtest): add vectorized backtest engine`
- `feat(backtest): add performance metrics`
- `feat(strategies): add momentum and rsi strategies`
- `docs: add backtest methodology report`

Phải xuất hiện:

- Backtest engine.
- Strategy definitions.
- Metrics.
- Backtest report với chart/screenshot.

## Week 5 GitHub

Commit nên có:

- `feat(ml): add forward return labels`
- `feat(ml): build factor dataset`
- `feat(ml): add walk-forward split`
- `feat(ml): train xgboost alpha model`
- `feat(strategies): add ml ranking strategy`

Phải xuất hiện:

- ML pipeline.
- Model evaluation report.
- Feature importance.
- ML backtest comparison.

## Week 6 GitHub

Commit nên có:

- `feat(frontend): scaffold react dashboard`
- `feat(frontend): add market data charts`
- `feat(frontend): add factor explorer`
- `feat(frontend): add backtest dashboard`
- `feat(frontend): add ml lab page`

Phải xuất hiện:

- Dashboard screenshots.
- Frontend API integration.
- Loading/error states.
- Demo flow in README.

## Week 7 GitHub

Commit nên có:

- `infra: add aws deployment guide`
- `infra: add lambda ingestion deployment notes`
- `infra: add ec2 docker deployment config`
- `docs: add aws cost plan and budget guardrails`

Phải xuất hiện:

- AWS architecture diagram.
- Deployment docs.
- Cost estimate.
- Security/IAM notes.

## Week 8 GitHub

Commit nên có:

- `docs: finalize project readme`
- `docs: add final technical report`
- `docs: add screenshots and demo script`
- `test: add end-to-end smoke checklist`
- `chore: final cleanup for portfolio release`

Phải xuất hiện:

- README đẹp.
- Demo screenshots/video link.
- Final report.
- Limitations and future work.
- Clear AWS services list.

---

# Phần 9 — Tài liệu học đề xuất

## Quant/Trading miễn phí hoặc thực hành

- **QuantStart** — articles về backtesting, strategy, risk: https://www.quantstart.com/
- **Investopedia** — tra khái niệm nhanh: https://www.investopedia.com/
- **Georgia Tech ML4T / Machine Learning for Trading** — rất hợp cho programmer: https://lucylabs.gatech.edu/ml4t/
- **Hudson & Thames blog** — ML finance, backtesting pitfalls: https://hudsonthames.org/research/
- **Ernie Chan blog/books** — practical quant trading ideas: https://epchan.blogspot.com/

## Backtesting/library docs

- vectorbt docs: https://vectorbt.dev/
- Backtrader docs: https://www.backtrader.com/docu/
- pandas docs: https://pandas.pydata.org/docs/
- NumPy docs: https://numpy.org/doc/

## ML

- XGBoost docs: https://xgboost.readthedocs.io/
- LightGBM docs: https://lightgbm.readthedocs.io/
- scikit-learn model evaluation: https://scikit-learn.org/stable/modules/model_evaluation.html
- scikit-learn time series split: https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html

## AWS miễn phí/thực hành

- AWS Skill Builder: https://skillbuilder.aws/
- AWS Well-Architected Framework: https://aws.amazon.com/architecture/well-architected/
- AWS S3 docs: https://docs.aws.amazon.com/s3/
- AWS Lambda docs: https://docs.aws.amazon.com/lambda/
- AWS EC2 docs: https://docs.aws.amazon.com/ec2/
- AWS Pricing Calculator: https://calculator.aws/

## YouTube gợi ý

- freeCodeCamp: Python finance/backtesting/AWS basics.
- StatQuest: ML concepts dễ hiểu.
- sentdex: Python finance/ML older but useful.
- AWS Official Channel: Lambda, S3, EC2 tutorials.

## Sách

Ưu tiên đọc chọn lọc, không đọc hết trước khi code:

- *Advances in Financial Machine Learning* — Marcos López de Prado. Khó, chỉ đọc phần data leakage, backtesting pitfalls.
- *Algorithmic Trading* — Ernest Chan. Practical hơn.
- *Python for Finance* — Yves Hilpisch. Hữu ích nhưng có thể nặng.
- *Machine Learning for Asset Managers* — Marcos López de Prado. Đọc sau nếu còn thời gian.

---

# Phần 10 — Sai lầm thường gặp

## Sai lầm Quant

1. **Look-ahead bias**
   - Dùng dữ liệu ngày tương lai để tạo signal ngày hiện tại.
   - Cách tránh: shift signal 1 ngày trước khi tính PnL.

2. **Survivorship bias**
   - Chỉ dùng cổ phiếu còn sống/thành công.
   - MVP chấp nhận nhưng phải ghi rõ limitation.

3. **Không tính transaction cost**
   - Strategy nhìn profitable giả tạo.
   - Luôn thêm cost/slippage tối thiểu.

4. **Overfitting strategy params**
   - Thử 100 params rồi chọn cái đẹp nhất.
   - Cần train/validation/test theo thời gian.

5. **Chỉ nhìn return, không nhìn drawdown**
   - Strategy return cao nhưng drawdown quá lớn.
   - Luôn báo cáo max drawdown, volatility, Sharpe.

6. **Không có benchmark**
   - Không biết strategy có hơn buy-and-hold không.
   - Luôn so với SPY/equal-weight.

## Sai lầm ML trong finance

1. **Random train/test split**
   - Sai vì dữ liệu thời gian bị trộn.
   - Dùng time split/walk-forward.

2. **Label leakage**
   - Feature vô tình chứa thông tin target tương lai.
   - Kiểm tra từng feature có dùng rolling đúng không.

3. **Accuracy cao nhưng trading kém**
   - Classification accuracy không đồng nghĩa PnL tốt.
   - Đánh giá bằng backtest + ranking quality.

4. **Không kiểm tra stability**
   - Model tốt ở một giai đoạn nhưng fail giai đoạn khác.
   - Chia nhiều period.

5. **Dùng Deep Learning quá sớm**
   - Dễ tốn thời gian, ít dữ liệu, khó giải thích.
   - XGBoost/LightGBM đủ tốt cho portfolio.

## Sai lầm AWS Credits

1. **Quên tắt EC2**
   - Cách tránh: stop instance khi không demo, đặt reminder.

2. **Dùng RDS/OpenSearch/SageMaker endpoint vì “ngầu”**
   - Dễ cháy credits.
   - Dùng SQLite/S3/Lambda/EC2 trước.

3. **CloudWatch logs retention vô hạn**
   - Logs có thể tích lũy.
   - Set retention 7 ngày.

4. **Không đặt Budget alert**
   - Không biết chi phí tăng.
   - Đặt alert ở $20, $50, $100.

5. **Public S3 bucket sai cách**
   - Rủi ro security.
   - Data bucket private; frontend bucket nếu public thì chỉ chứa static assets.

6. **Hardcode AWS keys**
   - Không commit secrets.
   - Dùng IAM role cho EC2/Lambda, `.env.example` không chứa secret.

---

# Phần 11 — Đánh giá tính khả thi

## Mức độ khả thi trong 8 tuần

**Khả thi: 8/10** nếu giữ đúng MVP và không mở rộng quá nhiều.

Lý do khả thi:

- Bạn đã biết Python, ML, FastAPI, DB, Docker, AWS cơ bản.
- Quant scope được giới hạn ở OHLCV/factors/backtesting/ML tabular.
- Không cần realtime trading.
- Không cần GPU.
- Không cần paid data.
- AWS architecture nhỏ, rẻ, đủ yêu cầu môn học.

## Phần có nguy cơ không hoàn thành

| Hạng mục | Rủi ro | Cách giảm rủi ro |
|---|---|---|
| Dashboard đẹp | Tốn thời gian UI | Dùng template/component library, ưu tiên biểu đồ quan trọng |
| ML alpha thật sự tốt | Dữ liệu noisy, return khó dự đoán | Đặt mục tiêu pipeline đúng hơn là PnL cao |
| AWS deploy | Lỗi IAM/CORS/Docker | Deploy Week 7 sớm, ghi docs từng bước |
| Backtest correctness | Dễ bias/leakage | Viết tests cho shift signal, transaction cost |
| Scope creep | Muốn thêm quá nhiều feature | Luôn giữ MVP checklist |

## MVP nếu thiếu thời gian

Nếu chỉ còn 4–5 tuần, làm bản MVP rút gọn:

1. Data ingestion 20 tickers.
2. S3 lưu raw/processed parquet.
3. 5 factors.
4. 1 momentum strategy.
5. 1 ML strategy XGBoost.
6. Backtest metrics cơ bản.
7. FastAPI endpoints.
8. Dashboard 3 trang: Overview, Backtest, ML.
9. Deploy EC2 backend + S3 data + Lambda ingestion.
10. README/report tốt.

Bỏ hoặc giảm:

- Nhiều chiến lược.
- CloudFront.
- RDS.
- Deep Learning.
- Realtime data.
- User authentication.
- Complex portfolio optimization.

## Definition of Done cuối dự án

QuantScope được xem là hoàn thành nếu:

- [ ] Có repo public GitHub sạch, không secret.
- [ ] README giải thích project, architecture, setup, screenshots.
- [ ] Có ít nhất 3 AWS services thật sự được dùng: S3, Lambda, EC2.
- [ ] Có data pipeline ingest dữ liệu market.
- [ ] Có factor engine với ít nhất 5 factors.
- [ ] Có backtesting engine với transaction cost.
- [ ] Có ML alpha model với time-based split.
- [ ] Có dashboard trực quan.
- [ ] Có deployment docs và cost estimate.
- [ ] Có final report nêu rõ limitations.

---

# Checklist thực thi ngắn gọn

## Mỗi tuần

- [ ] Code chạy được local.
- [ ] Có ít nhất 3–5 commits có ý nghĩa.
- [ ] README/docs được cập nhật.
- [ ] Có screenshot hoặc notebook/report chứng minh kết quả.
- [ ] Không commit secrets/data lớn.

## Mỗi feature

- [ ] Có input/output rõ ràng.
- [ ] Có test hoặc notebook kiểm chứng.
- [ ] Có docs ngắn.
- [ ] Có API/dashboard nếu liên quan.

## Trước khi deploy AWS

- [ ] AWS Budget alert.
- [ ] IAM least privilege.
- [ ] S3 bucket private cho data.
- [ ] EC2 security group chỉ mở port cần thiết.
- [ ] CloudWatch retention 7 ngày.
- [ ] Biết cách stop EC2.

---

# Kết luận mentoring

Chiến lược tốt nhất là: **làm một quant research platform nhỏ nhưng đúng quy trình**.

Điểm gây ấn tượng cho CV không phải là “model lời nhiều”, mà là bạn chứng minh được:

- Biết thiết kế data pipeline.
- Biết xây factor và backtest không leakage.
- Biết dùng ML trong financial time series một cách cẩn trọng.
- Biết deploy cloud tiết kiệm chi phí.
- Biết viết docs/report chuyên nghiệp.

Nếu giữ scope như kế hoạch này, QuantScope hoàn toàn có thể trở thành một GitHub Portfolio project rất mạnh trong 8 tuần.
