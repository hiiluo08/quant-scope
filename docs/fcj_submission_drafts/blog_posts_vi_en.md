# Three AWS Study Group Blog Drafts / Ba bản nháp blog

## Blog 1 — Xây data lake research chi phí thấp với S3, Lambda và Parquet

**VI:** QuantScope dùng S3 cho raw/processed/factor/model artifacts vì Parquet phù hợp dữ liệu dạng cột. Lambda chạy ingestion batch theo schedule EventBridge thay vì server chạy liên tục. Bài viết cần mô tả private bucket, IAM role, lifecycle cleanup, CloudWatch logs và lý do không public data bucket. **PLACEHOLDER:** thêm screenshot deployment thật, link workshop và permalink Facebook sau khi publish.

**EN:** QuantScope uses S3 for raw, processed, factor, and model artifacts because Parquet suits columnar research data. Lambda runs scheduled batch ingestion through EventBridge instead of an always-on server. The final post should explain private buckets, IAM roles, lifecycle cleanup, CloudWatch logs, and why research data is never public. **PLACEHOLDER:** add real deployment screenshots, workshop link, and Facebook permalink after publishing.

## Blog 2 — Tránh look-ahead bias trong backtest và ML tài chính

**VI:** Factor tại ngày t chỉ tạo signal t; engine shift position/PnL sang t+1. Transaction cost được tính từ turnover. ML label là forward return, split theo thời gian có embargo 5 ngày, validation chọn model còn test chỉ đánh giá. Đây là các guardrail quan trọng hơn một equity curve đẹp. **PLACEHOLDER:** thêm code snippet/test thật và permalink.

**EN:** A factor at date t produces a signal at t; the engine shifts position and PnL to t+1. Transaction costs derive from turnover. ML labels are forward returns, the split is chronological with a five-day embargo, validation selects a model, and test data is evaluation-only. These guardrails matter more than a visually attractive equity curve. **PLACEHOLDER:** add real code/test snippets and permalink.

## Blog 3 — Deploy research dashboard tối giản trên AWS với kiểm soát chi phí

**VI:** Frontend React build được host static trên S3; FastAPI chạy Docker trên Serverless (Lambda/ECS); Lambda/EventBridge cập nhật artifacts; CloudWatch/Budget theo dõi vận hành. Bài viết cần nêu Serverless (Lambda/ECS) stop procedure, budget thresholds, log retention, IAM least privilege, CORS origin allowlist và các trade-off của MVP không dùng CloudFront/RDS/EKS. **PLACEHOLDER:** thêm cost thực tế, screenshots và permalink.

**EN:** The React build is hosted statically on S3; FastAPI runs in Docker on Serverless (Lambda/ECS); Lambda/EventBridge refresh artifacts; CloudWatch and Budgets provide operational visibility. The final post should cover the Serverless (Lambda/ECS) stop procedure, budget thresholds, log retention, least-privilege IAM, CORS origin allowlist, and MVP trade-offs from not using CloudFront, RDS, or EKS. **PLACEHOLDER:** add actual costs, screenshots, and permalink.
