#!/bin/bash
set -e

# Get variables from Terraform
REGION=$(terraform -chdir=infra/terraform output -raw aws_region 2>/dev/null || echo "ap-southeast-1")
REPO_URL=$(terraform -chdir=infra/terraform output -raw ecr_repository_url)

if [ -z "$REPO_URL" ]; then
    echo "Error: ECR Repository URL not found. Did you run 'terraform apply'?"
    exit 1
fi

echo "Authenticating to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REPO_URL

echo "Building Docker image..."
docker build -t quantscope-backend -f backend/Dockerfile .

echo "Tagging image..."
docker tag quantscope-backend:latest $REPO_URL:latest

echo "Pushing image to ECR..."
docker push $REPO_URL:latest

echo "Successfully pushed to ECR!"
# Trigger ASG instance refresh to deploy the new image
ASG_NAME=$(terraform -chdir=infra/terraform output -raw asg_name 2>/dev/null || echo "quantscope-asg")
echo "Refreshing Auto Scaling Group: $ASG_NAME to deploy new image..."
aws autoscaling start-instance-refresh --auto-scaling-group-name $ASG_NAME --region $REGION
echo "Deployment initiated. Instances will be replaced one by one."
