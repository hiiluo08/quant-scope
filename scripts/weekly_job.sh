#!/bin/bash
set -e

# Đảm bảo đang đứng ở thư mục gốc của project
cd "$(dirname "$0")/.."

# Load môi trường Python
source .venv_linux/bin/activate

# Chạy ML Pipeline (Bao gồm Data Prep -> Train Models -> Evaluate -> Build ML Backtest)
echo "[Weekly Job] Running full ML Pipeline..."
python -m data_pipeline.jobs.run_ml_pipeline

echo "[Weekly Job] Done!"
