# QuantScope Project Scope

## 1. QuantScope là gì?

QuantScope là một nền tảng nghiên cứu chiến lược giao dịch định lượng (Quant Research Platform) sử dụng Machine Learning để phân tích dữ liệu thị trường, tạo factor, xây dựng chiến lược và đánh giá hiệu suất thông qua backtesting.

Luồng xử lý chính của hệ thống:

```text
Dữ liệu thị trường -> Factor Research -> Machine Learning -> Strategy Generation -> Backtesting -> Performance Analysis
```

Mục tiêu của QuantScope là giúp người học Quant và Algorithmic Trading đi từ dữ liệu thô đến một workflow nghiên cứu hoàn chỉnh, thay vì phải ghép nhiều công cụ rời rạc.

---

## 2. Người dùng mục tiêu là ai?

### Primary users

- Sinh viên học Quant Finance
- Sinh viên AI/ML
- Người mới học Algorithmic Trading
- Nhà nghiên cứu chiến lược giao dịch cá nhân

### Secondary users

- Data Scientist muốn khám phá dữ liệu tài chính
- AI Engineer muốn học Financial ML
- Người muốn thử nghiệm ý tưởng giao dịch trước khi đầu tư thật

### Không phải đối tượng

- Quỹ đầu tư chuyên nghiệp
- Hệ thống giao dịch tần suất cao (HFT)
- Trader chuyên nghiệp cần giao dịch realtime

---

## 3. Dự án giải quyết vấn đề gì?

### Vấn đề hiện tại

Người mới học Quant thường gặp một chuỗi rào cản rất phổ biến:

- Có dữ liệu nhưng không biết bắt đầu từ đâu
- Không biết tạo factor như thế nào
- Không biết biến factor thành chiến lược
- Không biết backtest ra sao cho đúng
- Không biết cách đọc kết quả để kết luận chiến lược có thực sự tốt hay không

### QuantScope giải quyết bằng cách

QuantScope cung cấp một workflow khép kín để người dùng có thể:

1. Upload hoặc thu thập dữ liệu
2. Tạo factor
3. Xây dựng strategy
4. Chạy backtest
5. Xem các chỉ số như Return, Sharpe Ratio, Drawdown, Win Rate
6. So sánh nhiều chiến lược với nhau

Mục tiêu không phải là thay thế hệ thống giao dịch thật, mà là tạo ra một môi trường học và nghiên cứu định lượng có cấu trúc rõ ràng.

---

## 4. MVP gồm những gì?

Trong 8 tuần đầu, MVP của QuantScope bao gồm các module sau.

### Module 1: Market Data Pipeline

**Nguồn dữ liệu:** Yahoo Finance

**Chức năng:**

- Download dữ liệu thị trường
- Lưu dữ liệu lên S3
- Đồng bộ dữ liệu với database local

### Module 2: Factor Engine

Các factor ban đầu:

- SMA
- EMA
- RSI
- Momentum
- Volatility

### Module 3: Strategy Builder

Hỗ trợ strategy rule-based đơn giản, ví dụ:

- RSI < 30 => BUY
- RSI > 70 => SELL

### Module 4: Backtesting Engine

Cho phép:

- Run Backtest

Kết quả hiển thị:

- Return
- Sharpe Ratio
- Drawdown
- Win Rate

### Module 5: Machine Learning Module

**Model:** XGBoost

**Input:**

- RSI
- Momentum
- Volatility
- Volume

**Output:**

- Dự đoán Future 5-Day Return

### Module 6: Dashboard

Dashboard hiển thị:

- Equity Curve
- Return
- Sharpe Ratio
- Drawdown
- Trade History

### Module 7: AWS

Dự án sử dụng tối thiểu 3 dịch vụ AWS:

- **Amazon S3:** lưu Historical Data và Model Artifacts
- **AWS Lambda:** Scheduled Data Collection
- **Amazon EC2:** chạy FastAPI và Dashboard

### Phạm vi dữ liệu MVP

Trong MVP, QuantScope tập trung vào **US Stocks / ETFs** để giữ phạm vi gọn, dễ lấy dữ liệu, và phù hợp với bài toán học tập trong 8 tuần.

---

## 5. Dự án không làm gì trong 8 tuần?

Để giữ scope đúng, QuantScope **không** làm các phần sau trong 8 tuần đầu:

- Không giao dịch thật, không mua bán cổ phiếu thật
- Không kết nối Broker như Alpaca, Interactive Brokers, Binance Trading API
- Không High Frequency Trading
- Không Reinforcement Learning như PPO, DQN, SAC
- Không Deep Learning phức tạp như TFT, Informer, PatchTST
- Không LLM Agent như Research Agent, Trader Agent, Risk Agent
- Không Portfolio Optimization như Modern Portfolio Theory, Black-Litterman
- Không Multi-Asset trong MVP

### Quy tắc phạm vi dữ liệu

MVP chỉ chọn **1 nhóm tài sản chính** để tránh lan man. Hướng mặc định của project là:

- **US Stocks / ETFs**

---

## 6. Thành công được đo bằng tiêu chí nào?

### Technical success

- Thu thập dữ liệu tự động
- Lưu dữ liệu trên S3
- API hoạt động ổn định
- Dashboard chạy được
- Deploy trên AWS

### Quant success

Người dùng có thể đi trọn flow:

- Tạo Factor
- Tạo Strategy
- Run Backtest
- Đánh giá Performance

### ML success

- Huấn luyện được XGBoost Alpha Model
- Tạo dự đoán lợi nhuận tương lai

### AWS success

- Sử dụng tối thiểu: S3, Lambda, EC2
- Tổng chi phí dưới 20 USD trong thời gian làm đồ án

### Portfolio success

GitHub có đầy đủ:

- README
- Architecture Diagram
- Screenshots
- Deployment Guide
- Demo Video

---

## Scope Statement ngắn gọn

QuantScope là nền tảng nghiên cứu giao dịch định lượng sử dụng Machine Learning, cho phép thu thập dữ liệu thị trường, xây dựng factor, tạo chiến lược giao dịch, thực hiện backtesting và phân tích hiệu suất thông qua dashboard trực quan. Hệ thống được triển khai trên AWS bằng các dịch vụ chi phí thấp (S3, Lambda, EC2) và hướng tới người học Quant, AI và Algorithmic Trading. Trong phạm vi 8 tuần, dự án tập trung vào nghiên cứu và đánh giá chiến lược, không bao gồm giao dịch thực tế, tối ưu danh mục đầu tư hay các mô hình Deep Learning phức tạp.

---

## Ghi chú phạm vi cho Week 1

Tài liệu này được viết để phục vụ Day 1 của Week 1 trong kế hoạch dự án. Mục tiêu của nó là chốt rõ:

- Dự án này là gì
- Ai sẽ dùng nó
- Nó giải quyết vấn đề nào
- MVP bao gồm những gì
- Nó không làm gì trong 8 tuần đầu
- Thành công sẽ được đo bằng gì

Từ tài liệu này, các tuần sau có thể phát triển tiếp mà không bị lệch scope.
