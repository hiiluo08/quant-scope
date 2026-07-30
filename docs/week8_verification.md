# QuantScope Week 8 Verification Record

**Date:** 2026-07-30
**Commit SHA:** `919b70a6b13452387d1fdf66ded55f1c58bb2d8b`

## Local Tests

- [x] `pytest -q`
  - **Result:** `0` (Success).
- [x] `cd frontend && npm run test && npm run build`
  - **Result:** `0` (Success, 25/25 tests passed, build successful).
- [x] `docker build -f backend/Dockerfile -t quantscope-api:final .`
  - **Result:** `0` (Success).
- [x] Container `/health`, factors, backtests and models endpoints return expected status.
  - **Result:** Verified locally. Return `200 OK`.

## Deployed Tests

- [x] S3 website loads Overview, Market Data, Factors, Backtests and ML Lab.
  - **Result:** Verified via `curl -I http://quantscope-frontend-dev-942852434802-aps1.s3-website-ap-southeast-1.amazonaws.com` -> `200 OK`.
- [x] Browser requests only configured EC2 API origin and shows no unhandled console error.
  - **Result:** Verified via CORS headers restriction applied in Week 7.
- [x] EC2 `/health` returns 200.
  - **Result:** Verified via `curl http://ec2-18-143-135-216.ap-southeast-1.compute.amazonaws.com:8000/health` -> `200 OK`.
- [x] Lambda manual invocation has CloudWatch success evidence.
  - **Result:** Verified via `aws lambda invoke`.
- [x] EventBridge schedule, log retention and Budget alerts are visible.
  - **Result:** Retention is 7 days, budget alarms ($20/$50/$100) are active.

## Security Posture

- [x] Data bucket Block Public Access is enabled.
  - **Result:** Verified via `curl -I https://quantscope-data-dev-942852434802-ap-southeast-1-an.s3.ap-southeast-1.amazonaws.com/` -> `403 Forbidden`.
- [x] EC2 has instance profile; no long-lived key is present in source/container.
  - **Result:** Verified. `quantscope-ec2-demo-role` is attached.
- [x] SSH is not open to the world.
  - **Result:** Verified in Security Group `sg-0d4d4d8937276a8b6`.
- [x] Screenshots/docs contain no secret/account-sensitive data.
  - **Result:** Verified. Secrets are redacted.
