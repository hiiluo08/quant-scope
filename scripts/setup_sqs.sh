#!/usr/bin/env bash
set -e

AWS_REGION="ap-southeast-1"
DATA_BUCKET=$(aws ssm get-parameter --name "/quantscope/data_bucket" --query "Parameter.Value" --output text 2>/dev/null || echo "quantscope-data-dev")
LAMBDA_ROLE_ARN=$(aws iam get-role --role-name quantscope-lambda-execution-role --query "Role.Arn" --output text 2>/dev/null || echo "")

echo "Setting up SQS Fan-Out Architecture..."

# 1. Create SQS Queue
SQS_QUEUE_URL=$(aws sqs create-queue \
  --queue-name quantscope-ingestion-queue \
  --attributes '{"VisibilityTimeout":"300","MessageRetentionPeriod":"86400"}' \
  --region "$AWS_REGION" \
  --query 'QueueUrl' --output text)

SQS_ARN=$(aws sqs get-queue-attributes \
  --queue-url "$SQS_QUEUE_URL" \
  --attribute-names QueueArn \
  --query 'Attributes.QueueArn' --output text \
  --region "$AWS_REGION")

echo "Created SQS Queue: $SQS_QUEUE_URL"

if [ -z "$LAMBDA_ROLE_ARN" ]; then
    echo "Warning: LAMBDA_ROLE_ARN not found. Skipping Lambda function creation."
    echo "Please set up the IAM role 'quantscope-lambda-execution-role' first."
    exit 0
fi

# 2. Deploy Lambda Producer
echo "Deploying Lambda Producer..."
zip -j /tmp/lambda_producer.zip data_pipeline/ingestion/lambda_producer.py
aws lambda create-function \
  --function-name quantscope-lambda-producer \
  --runtime python3.12 \
  --role "$LAMBDA_ROLE_ARN" \
  --handler lambda_producer.lambda_handler \
  --zip-file fileb:///tmp/lambda_producer.zip \
  --timeout 60 --memory-size 256 \
  --environment "Variables={S3_BUCKET_NAME=$DATA_BUCKET,SQS_QUEUE_URL=$SQS_QUEUE_URL}" \
  --region "$AWS_REGION" || \
aws lambda update-function-code \
  --function-name quantscope-lambda-producer \
  --zip-file fileb:///tmp/lambda_producer.zip \
  --region "$AWS_REGION"

# Note: The Lambda Consumer requires dependencies (pandas, yfinance) 
# and should be deployed via a Container Image (ECR) or Lambda Layer.
echo "=========================================================="
echo "SQS Setup Complete."
echo "Queue ARN: $SQS_ARN"
echo "Next steps:"
echo "1. Build and deploy the Docker image for quantscope-lambda-consumer"
echo "2. Attach SQS trigger to the consumer using AWS Console or CLI"
echo "3. Update EventBridge target to trigger the Producer instead of the Consumer"
echo "=========================================================="
