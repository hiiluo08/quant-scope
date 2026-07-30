# Workshop Draft — QuantScope AWS Research Platform

> Chuyển nội dung này vào đúng file VI/EN của template Hugo sau khi đọc cấu trúc template.

## Tiếng Việt

### Tổng quan
QuantScope là nền tảng nghiên cứu định lượng phục vụ học tập. Hệ thống lấy dữ liệu giá thị trường công khai, chuẩn hóa dữ liệu, tính factor, chạy backtest rule-based có mô phỏng transaction cost, huấn luyện baseline ML dự đoán forward return và hiển thị artifact qua dashboard. Đây không phải hệ thống giao dịch thật và không phải lời khuyên đầu tư.

### Bài toán
Người học Quant thường có notebook rời rạc, thiếu pipeline tái lập, không kiểm soát look-ahead bias và thiếu cách trình bày kết quả. QuantScope tập trung vào flow có kiểm chứng: dữ liệu → factor causal → signal/position → backtest net-of-cost → ML time split → dashboard.

### Mục tiêu
- Tạo research pipeline có thể tái lập trên universe US stocks/ETFs cố định.
- Dùng ít nhất ba AWS services: Amazon S3, Amazon EC2 và AWS Lambda.
- Có dashboard đọc artifact đã persist thay vì chạy compute qua browser.
- Có logging, scheduling, IAM least privilege, cost control và cleanup procedure.

### Kiến trúc AWS
- **S3 private data bucket:** raw/processed data, factor values, backtest/model artifacts.
- **EC2 + Docker + FastAPI:** read-only API cho dashboard; EC2 instance profile chỉ đọc prefixes cần thiết.
- **S3 static website bucket:** host React/Vite dashboard; không chứa credentials.
- **Lambda + EventBridge:** ingestion batch theo schedule; Lambda execution role chỉ ghi data prefixes cần thiết.
- **CloudWatch + AWS Budgets:** log, retention và cost alerts.

### Kết quả mong đợi
Dashboard hiển thị market data, factors, backtests và ML artifacts. Người dùng có thể kiểm tra method/limitation, nhưng không thể tạo trade, train model hoặc chạy backtest qua UI.

## English

### Overview
QuantScope is an educational quantitative-research platform. It ingests public market-price data, normalizes it, computes factors, runs rule-based backtests with modeled transaction costs, trains baseline machine-learning forward-return models, and exposes persisted artifacts through a dashboard. It is not a live-trading system and does not provide investment advice.

### Problem
Quant learners often work with disconnected notebooks, non-reproducible pipelines, unmanaged look-ahead bias, and poorly communicated results. QuantScope provides a verifiable flow: data → causal factors → signal/position → net-of-cost backtest → time-based ML split → dashboard.

### Objectives
- Build a reproducible research pipeline for a fixed US stock/ETF universe.
- Use at least three AWS services: Amazon S3, Amazon EC2, and AWS Lambda.
- Serve persisted research artifacts through a dashboard instead of browser-triggered computation.
- Demonstrate logging, scheduling, least-privilege IAM, cost controls, and cleanup.

### AWS architecture
- **Private S3 data bucket:** raw/processed data, factor values, backtest/model artifacts.
- **EC2 + Docker + FastAPI:** read-only dashboard API; the instance profile reads only required prefixes.
- **Static-website S3 bucket:** React/Vite dashboard hosting with no credentials.
- **Lambda + EventBridge:** scheduled batch ingestion; its execution role writes only required data prefixes.
- **CloudWatch + AWS Budgets:** logs, retention and cost alerts.

### Expected result
The dashboard displays market data, factors, backtests, and ML artifacts. Users can inspect methodology and limitations, but cannot trade, train a model, or run a backtest from the UI.
