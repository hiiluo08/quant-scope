#!/bin/bash
set -e

# Đảm bảo đang đứng ở thư mục gốc của project
cd "$(dirname "$0")/.."

# Load môi trường Python
source .venv_linux/bin/activate

# 1. Cập nhật dữ liệu OHLCV mới nhất cho đến ngày hôm nay và tính lại toàn bộ Factors
TODAY=$(date +%Y-%m-%d)
echo "[Daily Job] Updating Universe & Factors up to $TODAY..."
python -m data_pipeline.jobs.update_universe --end-date "$TODAY" --compute-factors

# 2. Chạy lại rule-based backtests (Momentum, RSI...)
echo "[Daily Job] Running Baseline Backtests..."
python -m data_pipeline.jobs.run_backtests

# Lưu ý: Việc lấy model ML để predict daily signal hiện đang ghép chung trong run_ml_pipeline.
# Để tối ưu, bạn có thể tạo thêm file run_ml_inference.py chỉ để load mô hình đã train ra dự đoán.
# Còn hiện tại script này hoàn thành cập nhật Data, Factors và Rule-based Backtests hàng ngày.

# 3. Chạy ML Inference dựa trên mô hình (champion model) gần nhất để có ML Signals hằng ngày
echo "[Daily Job] Running ML Inference..."
python -m data_pipeline.jobs.run_ml_inference

echo "[Daily Job] Done!"

