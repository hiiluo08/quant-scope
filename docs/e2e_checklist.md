# QuantScope E2E Checklist

## Local

- [x] `pytest -q` exits 0.
- [x] `cd frontend && npm run test && npm run build` exits 0.
- [x] `docker build -f backend/Dockerfile -t quantscope-api:final .` exits 0.
- [x] Container `/health`, factors, backtests and models endpoints return expected status.

## Deployed

- [x] S3 website loads Overview, Market Data, Factors, Backtests and ML Lab.
- [x] Browser requests only configured Serverless (Lambda/ECS) API origin and shows no unhandled console error.
- [x] Serverless (Lambda/ECS) `/health` returns 200.
- [x] Lambda manual invocation has CloudWatch success evidence.
- [x] EventBridge schedule, log retention and Budget alerts are visible.

## Security

- [x] Data bucket Block Public Access is enabled.
- [x] Serverless (Lambda/ECS) has instance profile; no long-lived key is present in source/container.
- [x] SSH is not open to the world.
- [x] Screenshots/docs contain no secret/account-sensitive data.
