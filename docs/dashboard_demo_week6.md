# QuantScope Week 6 — Research Dashboard Demo Script

> **Purpose:** 5–7 minute walkthrough of the read-only research dashboard for reviewers and peer auditors.

---

## Pre-demo Checklist & Command Gate

1. **Verify Backend APIs & Health:**

   ```bash
   pytest -q
   uvicorn backend.app.main:app --port 8000
   ```

2. **Verify Frontend Suite & Build:**

   ```bash
   cd frontend
   npm run test
   npm run build
   ```

3. **API Smoke Verification:**
   - `curl --fail http://localhost:8000/health`
   - `curl --fail http://localhost:8000/api/v1/market-data/symbols`
   - `curl --fail http://localhost:8000/api/v1/factors`
   - `curl --fail http://localhost:8000/api/v1/backtests`
   - `curl --fail http://localhost:8000/api/v1/models`

---

## Timed Speaker Script (5–7 minutes)

### 1. Overview & Research-Only Boundary (0:00 – 0:45)

- **Action:** Open `http://localhost:5173/` in browser.
- **Talking Points:**
  - QuantScope Dashboard là giao diện đọc kết quả nghiên cứu định lượng (read-only research viewer).
  - Không khởi chạy compute/training job từ browser và không phát ra tín hiệu giao dịch realtime.
  - Trang Overview hiển thị tình trạng backend `/health` và tổng quan quy trình dữ liệu từ Market Data → Factors → Backtests → ML Lab.

### 2. Market Data Explorer (0:45 – 1:30)

- **Action:** Click chuyển sang tab `Market Data`, chọn mã `SPY`.
- **Talking Points:**
  - Quan sát đồ thị đường Adjusted Close Price và đồ thị cột Volume tách biệt (không dùng trục kép - dual axis để tránh méo thị giác).
  - Bảng dữ liệu OHLCV hiển thị 100 phiên gần nhất với nhãn mác rõ ràng.
  - Disclaimer nhấn mạnh: dữ liệu giá quá khứ chỉ phục vụ nghiên cứu mô hình, không phải cam kết lợi nhuận.

### 3. Factors Explorer (1:30 – 2:30)

- **Action:** Click chuyển sang tab `Factors`, chọn factor `momentum_20d` và symbol `SPY`.
- **Talking Points:**
  - Hiển thị thông số metadata: Factor version (`v1`), Warm-up periods (`20`).
  - Đồ thị Factor value chuỗi thời gian tách biệt hoàn toàn với đồ thị giá.
  - Bảng "Latest values for momentum_20d" tổng hợp giá trị mới nhất của toàn bộ danh mục mã.
  - Các ô warm-up được ghi nhận là `N/A` chính xác, không tự suy đoán giá trị.

### 4. Backtest Results Dashboard (2:30 – 3:45)

- **Action:** Click chuyển sang tab `Backtests`, chọn backtest artifact ID.
- **Talking Points:**
  - Đọc các thông số thiết lập: Engine version, transaction cost (5 bps), slippage (5 bps).
  - Thẻ chỉ số hiệu năng (Metric Cards): Total Return, Sharpe Ratio, Max Drawdown, CAGR, Turnover, Exposure, Win Rate...
  - Hai đồ thị tách biệt: **Net Equity Curve** (đường tăng trưởng tài sản ròng) và **Drawdown Curve** (mức sụt giảm từ đỉnh).
  - Nguyên tắc timing: Tín hiệu sinh ra tại $t$, thực thi vị thế/PnL tính tại $t+1$.

### 5. ML Research Lab (3:45 – 4:45)

- **Action:** Click chuyển sang tab `ML Lab`, chọn model manifest và đổi giữa các split `test` / `validation`.
- **Talking Points:**
  - Manifest chi tiết về mô hình: Family (`xgboost`/`lightgbm`), feature columns, split dates, hyperparameters.
  - So sánh bảng metrics trên tập Validation và tập Out-of-sample Test.
  - Bảng dữ liệu dự đoán 5-day forward return không sử dụng màu sắc gợi ý mua/bán (buy/sell signals).

### 6. Resilient UX & Failure Handling (4:45 – 5:30)

- **Action:** Mô phỏng ngắt kết nối API hoặc chọn artifact chưa tồn tại.
- **Talking Points:**
  - Dashboard hiển thị trạng thái `AsyncState`: Spinner khi `loading`, Banner có nút `Retry` khi `error` (HTTP 404/500).
  - Khi danh sách artifact rỗng, hiển thị màn hình `empty` hướng dẫn chi tiết lệnh pipeline cần chạy.

### 7. Wrap-up & Reviewer Q&A (5:30 – 7:00)

- **Talking Points:**
  - Nhấn mạnh tính an toàn: Browser chỉ gửi `GET` request tới `VITE_API_BASE_URL`, không đính kèm credentials bí mật.
  - Sẵn sàng bàn giao cho Tuần 7 (AWS Cloud Infrastructure Deployment).
