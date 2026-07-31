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

echo "Building Docker image (with --provenance=false for AWS Lambda compatibility)..."
docker build --provenance=false -t quantscope-backend -f backend/Dockerfile .

echo "Tagging image..."
docker tag quantscope-backend:latest $REPO_URL:latest

echo "Pushing image to ECR..."
docker push $REPO_URL:latest

echo "Successfully pushed to ECR!"

echo "Updating AWS Lambda to use the latest image..."
aws lambda update-function-code --function-name quantscope-backend-api --image-uri $REPO_URL:latest --region $REGION > /dev/null || echo "Note: Lambda function might not exist yet. Terraform will create it."
echo "Deployment completed!"
