# Workshop Steps Draft — QuantScope on AWS / Hướng dẫn Workshop

## Prerequisites / Điều kiện chuẩn bị

- AWS account, MFA-enabled non-root deployment identity, AWS CLI, Docker, Python, Node.js, Hugo template clone.
- Region: **PLACEHOLDER: actual AWS region**.
- Public frontend and API URLs: **PLACEHOLDER after deployment**.
- Do not use an access key in source, `.env` committed to Git, or Vite `VITE_*` for secrets.

## Step 1 — IAM / IAM least privilege

**VI:** Tạo deployment identity, Serverless (Lambda/ECS) instance role đọc S3 prefixes cần thiết, Lambda execution role ghi ingestion prefixes và CloudWatch logging. Kiểm tra policy không có wildcard resources không cần thiết.

**EN:** Create a deployment identity, an Serverless (Lambda/ECS) instance role that reads only required S3 prefixes, and a Lambda execution role that writes ingestion prefixes and CloudWatch logs. Verify policies do not contain unnecessary wildcard resources.

## Step 2 — S3 / Private data and static frontend buckets

**VI:** Tạo data bucket private có Block Public Access, encryption và lifecycle. Tạo frontend bucket riêng để host Vite static site; chỉ bucket frontend có public read objects.

**EN:** Create a private data bucket with Block Public Access, encryption, and lifecycle rules. Create a separate frontend bucket for the Vite static site; only the frontend bucket exposes public read objects.

## Step 3 — Serverless (Lambda/ECS) / Docker FastAPI

**VI:** Build Docker image, tạo Serverless (Lambda/ECS) có instance profile, restrict SSH, expose API demo port theo thời gian cần thiết. Kiểm tra `/health`, factor/backtest/model read APIs từ public endpoint.

**EN:** Build the Docker image, launch Serverless (Lambda/ECS) with an instance profile, restrict SSH, and expose the API demo port only when needed. Verify `/health`, factor, backtest, and model read APIs from the public endpoint.

## Step 4 — Lambda and EventBridge

**VI:** Package ingestion handler, set environment variables không chứa secret, invoke thủ công trước. Khi S3 output và CloudWatch logs đúng, tạo/enable EventBridge schedule với UTC documented.

**EN:** Package the ingestion handler, set non-secret environment variables, and invoke it manually first. After S3 output and CloudWatch logs are correct, create/enable the EventBridge schedule with documented UTC time.

## Step 5 — Test, observability, cost / Kiểm thử, giám sát, chi phí

- Test dashboard S3 → Serverless (Lambda/ECS) API → persisted artifact.
- Verify Lambda manual and scheduled logs; retention 7 days.
- Verify AWS Budget alerts at $20/$50/$100.
- Verify CORS exact frontend origin, data bucket private, and SSH source restricted.

## Cleanup / Dọn dẹp

**VI:** Stop Serverless (Lambda/ECS) ngay sau demo, disable EventBridge schedule nếu không cần, delete test objects theo lifecycle, review Budget/CloudWatch. Chỉ delete bucket/role/alarm khi project không còn cần evidence.

**EN:** Stop Serverless (Lambda/ECS) immediately after the demo, disable the EventBridge schedule when it is not needed, remove test objects through lifecycle rules, and review Budget/CloudWatch. Delete buckets, roles, and alarms only when project evidence is no longer needed.

## Required evidence / Minh chứng bắt buộc

- Screenshot/CLI output of private-data bucket configuration and static-site URL.
- Serverless (Lambda/ECS) API health response and dashboard screen.
- Lambda CloudWatch log and EventBridge schedule.
- IAM policy screenshots/text with sensitive identifiers redacted.
- Budget alert configuration and cleanup/stop procedure.
