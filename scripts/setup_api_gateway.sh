#!/usr/bin/env bash
set -e

AWS_REGION="ap-southeast-1"
EC2_PUBLIC_DNS=$(aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --query "Reservations[0].Instances[0].PublicDnsName" --output text --region "$AWS_REGION")

if [ -z "$EC2_PUBLIC_DNS" ] || [ "$EC2_PUBLIC_DNS" == "None" ]; then
    echo "Error: Could not find a running EC2 instance to route API Gateway to."
    exit 1
fi

echo "Creating HTTP API Gateway routing to http://$EC2_PUBLIC_DNS:8000"

# 1. Create HTTP API
API_ID=$(aws apigatewayv2 create-api \
  --name quantscope-api-gateway \
  --protocol-type HTTP \
  --cors-configuration '{
    "AllowOrigins": ["http://quantscope-frontend-dev-942852434802-aps1.s3-website-ap-southeast-1.amazonaws.com"],
    "AllowMethods": ["GET", "OPTIONS"],
    "AllowHeaders": ["*"]
  }' \
  --region "$AWS_REGION" \
  --query 'ApiId' --output text)

# 2. Create Integration pointing to EC2
INTEGRATION_ID=$(aws apigatewayv2 create-integration \
  --api-id "$API_ID" \
  --integration-type HTTP_PROXY \
  --integration-method ANY \
  --integration-uri "http://$EC2_PUBLIC_DNS:8000/{proxy}" \
  --payload-format-version "1.0" \
  --region "$AWS_REGION" \
  --query 'IntegrationId' --output text)

# 3. Create catch-all route
aws apigatewayv2 create-route \
  --api-id "$API_ID" \
  --route-key 'ANY /{proxy+}' \
  --target "integrations/$INTEGRATION_ID" \
  --region "$AWS_REGION" > /dev/null

# Health check route
aws apigatewayv2 create-route \
  --api-id "$API_ID" \
  --route-key 'GET /health' \
  --target "integrations/$INTEGRATION_ID" \
  --region "$AWS_REGION" > /dev/null

# 4. Auto-deploy stage
aws apigatewayv2 create-stage \
  --api-id "$API_ID" \
  --stage-name '$default' \
  --auto-deploy \
  --region "$AWS_REGION" > /dev/null

# 5. Get endpoint URL
API_URL=$(aws apigatewayv2 get-api \
  --api-id "$API_ID" \
  --region "$AWS_REGION" \
  --query 'ApiEndpoint' --output text)

echo "=========================================================="
echo "API Gateway created successfully!"
echo "HTTPS Endpoint: $API_URL"
echo "Please update the <api-id> in backend/app/main.py and frontend/.env.production"
echo "=========================================================="
