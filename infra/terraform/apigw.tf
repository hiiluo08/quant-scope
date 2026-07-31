# 1. API Gateway HTTP API
resource "aws_apigatewayv2_api" "backend" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"] # Giói hạn lại thành domain Amplify sau
    allow_methods = ["GET", "POST", "OPTIONS", "PUT", "DELETE"]
    allow_headers = ["content-type", "authorization"]
    max_age       = 300
  }
}

# 2. API Gateway Integration with Lambda
resource "aws_apigatewayv2_integration" "backend" {
  api_id           = aws_apigatewayv2_api.backend.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.backend_api.invoke_arn
  
  integration_method = "POST" # Lambda AWS_PROXY always requires POST integration method
  
  payload_format_version = "2.0" # API Gateway HTTP APIs typically use 2.0 for Lambda
}

# 4. Route
resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.backend.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.backend.id}"
}

# 5. Stage
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.backend.id
  name        = "$default"
  auto_deploy = true
}

output "api_gateway_url" {
  value = aws_apigatewayv2_api.backend.api_endpoint
}
