# QuantScope — AWS Deployment Documentation & Runbook

## 1. Overview & Topology Architecture

- **Frontend**: Static website hosted on Public S3 Bucket (`quantscope-frontend-dev-942852434802-aps1`).
- **Backend API**: FastAPI Docker container deployed on EC2 (`quantscope-ec2-demo`, `t3.micro`, Amazon Linux 2023).
- **Data Storage**: Private S3 Bucket (`quantscope-data-dev-942852434802-ap-southeast-1-an`) for raw, processed, factor, and model artifact data. Block Public Access enabled.
- **Scheduled Ingestion**: AWS Lambda (`quantscope-lambda-ingestion`, Python 3.12) triggered by EventBridge Schedule (`cron(0 22 ? * MON-FRI *)` UTC).
- **Logging & Monitoring**: CloudWatch Logs with 7-day retention policy.
- **Security & IAM**: Least privilege IAM roles (`quantscope-ec2-demo-role`, `quantscope-lambda-ingestion-role`). No static credentials stored on EC2 or Lambda.

## 2. Resource Inventory

| Resource Name | Type | Region | Identity / Identifier |
| :--- | :--- | :--- | :--- |
| `quantscope-data-dev-942852434802-ap-southeast-1-an` | S3 Private Bucket | `ap-southeast-1` | Data & Artifact Storage |
| `quantscope-frontend-dev-942852434802-aps1` | S3 Public Website | `ap-southeast-1` | Static Vite Build Hosting |
| `quantscope-ec2-demo` | EC2 Instance | `ap-southeast-1` | `i-0f40c2c573e6a2e1d` (t3.micro) |
| `quantscope-ec2-demo-role` | IAM Role / Instance Profile | Global | EC2 Read Access to S3 |
| `quantscope-lambda-ingestion` | AWS Lambda Function | `ap-southeast-1` | Ingestion Function |
| `quantscope-lambda-ingestion-role` | IAM Role | Global | Lambda Write Access to S3 |
| `quantscope-daily-ingestion-schedule` | EventBridge Rule | `ap-southeast-1` | Scheduled Ingestion Trigger |

## 3. Operations Runbook

### Stop EC2 Instance (Cost Saving)
To stop the EC2 instance after demo:
```bash
./scripts/stop_ec2.sh
```

### Start EC2 Instance
To start EC2 instance for demo:
```bash
aws ec2 start-instances --instance-ids i-0f40c2c573e6a2e1d --region ap-southeast-1
```
