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

# 2. VPC Link to ALB
resource "aws_apigatewayv2_vpc_link" "backend" {
  name               = "${var.project_name}-vpc-link"
  security_group_ids = [aws_security_group.alb_sg.id]
  subnet_ids         = aws_subnet.private[*].id # VPC link requires private subnets for internal ALBs, or public for public ALBs.
}

# 3. API Gateway Integration with ALB
resource "aws_apigatewayv2_integration" "backend" {
  api_id           = aws_apigatewayv2_api.backend.id
  integration_type = "HTTP_PROXY"
  integration_uri  = aws_lb_listener.http.arn

  integration_method = "ANY"
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.backend.id
  
  payload_format_version = "1.0"
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
