# QuantScope — AWS Deployment & Serverless Architecture

## 1. Overview & Topology Architecture

The entire infrastructure of QuantScope has been modernized and migrated to a **100% Serverless** architecture provisioned entirely via **Terraform** (`infra/terraform`).

- **Frontend**: Single Page Application (React + Vite) hosted via **AWS Amplify**. Features global CDN edge delivery and automated deployments.
- **Backend API**: FastAPI framework served by **AWS Lambda** via **Amazon API Gateway** using Mangum. Highly available and scales to zero.
- **Machine Learning & Cron Jobs**: Heavy compute tasks (ML model training, complex backtesting, data processing) run on **Amazon ECS (Fargate)**. Scheduled automatically using **Amazon EventBridge**.
- **Data Storage (Data Lake)**: Market data, factor values, and ML models are stored securely in a private **Amazon S3** bucket.
- **Container Registry**: A unified Docker image serving both the Lambda API and ECS Jobs is stored in **Amazon ECR**.
- **Logging & Monitoring**: Consolidated logs for Lambda and ECS are sent to **Amazon CloudWatch Logs** with a 7-day retention policy.
- **Security & IAM**: Granular Least-Privilege IAM Roles ensure Lambda and ECS tasks only have access to specific S3 buckets. No static credentials are used.

## 2. Resource Inventory

| Resource Name | Type | Region | Purpose |
| :--- | :--- | :--- | :--- |
| `quant-scope-data-*` | S3 Private Bucket | `ap-southeast-1` | Data Lake (Parquet data & Model artifacts) |
| `quant-scope-amplify` | AWS Amplify | `ap-southeast-1` | Frontend Web Hosting (Global CDN) |
| `quant-scope-api` | AWS Lambda | `ap-southeast-1` | FastAPI Backend Serverless Execution |
| `quant-scope-gateway` | Amazon API Gateway | `ap-southeast-1` | HTTP API routing to Lambda |
| `quant-scope-backend` | Amazon ECR | `ap-southeast-1` | Docker container registry |
| `quant-scope-cluster` | Amazon ECS (Fargate) | `ap-southeast-1` | Heavy Compute Cluster for ML |
| `daily_backtest_rule` | EventBridge Rule | `ap-southeast-1` | Triggers daily ECS Job (Data, Factors, Inference) |
| `weekly_ml_rule` | EventBridge Rule | `ap-southeast-1` | Triggers weekly ECS Job (ML Training) |

## 3. Operations Runbook

### Deploying Infrastructure
Navigate to the `infra/terraform` directory and execute:
```bash
terraform init
terraform apply -target=aws_ecr_repository.backend
# Build and push your Docker image to ECR...
terraform apply
```

### Cost Control
Since the architecture is 100% Serverless:
- You pay nothing when the system is idle.
- There are no Serverless (Lambda/ECS) instances to start or stop.
- ECS Fargate tasks automatically terminate once the ML training or inference job finishes.

### Accessing the Web Dashboard
After running `terraform apply`, Terraform will output the `amplify_branch_url` which provides direct access to the live web dashboard.
