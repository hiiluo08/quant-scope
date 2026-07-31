# 1. IAM Role for Lambda Backend
resource "aws_iam_role" "lambda_backend_role" {
  name = "${var.project_name}-lambda-backend-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# 2. Attach policies to Lambda (CloudWatch logs, S3 access)
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_backend_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_s3_read" {
  role       = aws_iam_role.lambda_backend_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}

# 3. Lambda Function for the Backend API
resource "aws_lambda_function" "backend_api" {
  function_name = "${var.project_name}-backend-api"
  role          = aws_iam_role.lambda_backend_role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.backend.repository_url}:latest"

  timeout     = 30 # Tối đa 30s cho API request
  memory_size = 512 # RAM 512MB cho FastAPI

  environment {
    variables = {
      APP_ENV     = "production"
      AWS_REGION  = var.aws_region
      BUCKET_NAME = aws_s3_bucket.data_lake.bucket
    }
  }
}

# 4. Permission for API Gateway to invoke Lambda
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.backend.execution_arn}/*/*"
}
