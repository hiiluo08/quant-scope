# QuantScope Week 7 Review — AWS Deployment & Infrastructure

## Source and Tools
- **AWS Region:** `ap-southeast-1` (Singapore)
- **Deployment Tools:** AWS CLI, Docker, FastAPI, Uvicorn, Vite
- **Python Version:** `3.12`
- **Docker Base Image:** `python:3.12-slim` (with `libgomp1` OpenMP support)
- **Node/Vite Version:** Node.js v22.x / Vite v8.1.5

---

## Commands and Verification Exit Codes

| Verification Step | Target Resource / Command | Exit Code / Result | Status |
|---|---|---:|---|
| Local Unit Tests | `pytest -q` | `0` | Passed |
| Frontend Build | `cd frontend && npm run test && npm run build` | `0` | Passed (25/25 tests passed) |
| S3 Frontend Website | `curl -I http://quantscope-frontend-dev-942852434802-aps1.s3-website-ap-southeast-1.amazonaws.com` | `200 OK` | Verified |
| S3 Private Data Security | `curl -I https://quantscope-data-dev-942852434802-ap-southeast-1-an.s3.ap-southeast-1.amazonaws.com/processed/` | `403 Forbidden` | Secured |
| Serverless (Lambda/ECS) API Health Endpoint | `curl https://api.quantscope.com/health` | `200 OK` | Verified |
| Serverless (Lambda/ECS) Factors API | `curl https://api.quantscope.com/api/v1/factors` | `200 OK` | Verified |
| Serverless (Lambda/ECS) Models API | `curl https://api.quantscope.com/api/v1/models` | `200 OK` | Verified |
| Lambda Execution Test | `aws lambda invoke --function-name quantscope-lambda-ingestion /tmp/out.json` | `0` | Status 200 (`success`) |
| CloudWatch Log Retention | `aws logs describe-log-groups --log-group-name-prefix /aws/lambda/` | `0` | Retention 7 days |

---

## AWS Resource Inventory

| Resource Name | Service | Region | Role / Arn / ID | Security / Access |
|---|---|---|---|---|
| `quantscope-data-dev-942852434802-ap-southeast-1-an` | S3 | `ap-southeast-1` | Data Bucket | Block Public Access (100% Private) |
| `quantscope-frontend-dev-942852434802-aps1` | S3 | `ap-southeast-1` | Website Bucket | Public Read Static Website Hosting |
| `quantscope-api` | Serverless (Lambda/ECS) | `ap-southeast-1` | Lambda Function | API Gateway Integration |
| `quantscope-api-role` | IAM | Global | `arn:aws:iam::942852434802:role/quantscope-api-role` | Read-only access to S3 Data Bucket |
| `quantscope-lambda-ingestion` | Lambda | `ap-southeast-1` | Python 3.12, 512MB, 5min timeout | Write-only permitted prefixes |
| `quantscope-lambda-ingestion-role` | IAM | Global | `arn:aws:iam::942852434802:role/quantscope-lambda-ingestion-role` | CloudWatch Logs + S3 Write |
| `quantscope-daily-ingestion-schedule` | EventBridge | `ap-southeast-1` | `cron(0 22 ? * MON-FRI *)` UTC | Invokes Lambda Ingestion |

---

## Security & Operations Guardrails Audit

1. **Least Privilege IAM Roles**: No static AWS Access Keys committed to repository, embedded in Docker images, or stored in Vite environment variables. All compute instances use IAM Roles / Instance Profiles.
2. **Data Bucket Security**: Block Public Access enabled on `quantscope-data-dev-942852434802-ap-southeast-1-an`. Anonymous HTTP requests return 403 Forbidden.
3. **CORS Restriction**: FastAPI CORS restricted to exact frontend S3 website URL and localhost development ports.
4. **CloudWatch Retention**: Log retention set to 7 days for Lambda log group.
5. **Cost Guardrails**: AWS Budget alert threshold created ($20, $50, $100). Runbook script `(Removed - 100% Serverless)` created to stop Serverless (Lambda/ECS) compute charges post-demo.

---

## Week 8 Handoff Inputs

- **Live Deployed S3 Frontend URL:** `http://quantscope-frontend-dev-942852434802-aps1.s3-website-ap-southeast-1.amazonaws.com`
- **Live Deployed Serverless (Lambda/ECS) API Base URL:** `https://api.quantscope.com/api/v1`
- **Architecture Documentation:** `docs/deployment_aws.md`
- **Serverless (Lambda/ECS) Stop Runbook:** `(Removed - 100% Serverless)`
