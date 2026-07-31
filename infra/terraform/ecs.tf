# ECS Cluster
resource "aws_ecs_cluster" "quant_cluster" {
  name = "${var.project_name}-cluster"
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.project_name}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = { Service = "ecs-tasks.amazonaws.com" }
        Effect    = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Provide S3 access to ECS tasks (for downloading data, saving models)
resource "aws_iam_role_policy_attachment" "ecs_s3_access" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

# Task Definition for Heavy Jobs (Backtest & ML Training)
resource "aws_ecs_task_definition" "ml_jobs" {
  family                   = "${var.project_name}-ml-jobs"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 2048 # 2 vCPU for XGBoost / LightGBM
  memory                   = 4096 # 4GB RAM to prevent OOM
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "quant-job"
      image = "${aws_ecr_repository.backend.repository_url}:latest"
      environment = [
        { name = "APP_ENV", value = "production" },
        { name = "BUCKET_NAME", value = aws_s3_bucket.data_lake.bucket }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.project_name}-jobs"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# Cloudwatch Log Group for ECS
resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/${var.project_name}-jobs"
  retention_in_days = 7
}
