# IAM Role for EventBridge to invoke ECS and Lambda
resource "aws_iam_role" "eventbridge_role" {
  name = "${var.project_name}-eventbridge-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = { Service = "events.amazonaws.com" }
        Effect    = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy" "eventbridge_invoke_policy" {
  name = "${var.project_name}-invoke-policy"
  role = aws_iam_role.eventbridge_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "ecs:RunTask"
        Resource = aws_ecs_task_definition.ml_jobs.arn
      },
      {
        Effect   = "Allow"
        Action   = "iam:PassRole"
        Resource = aws_iam_role.ecs_task_execution_role.arn
      }
    ]
  })
}

# 1. DAILY JOB: Run Backtests via ECS Fargate (01:00 UTC)
# Note: Data Ingestion (Lambda) is triggered at 00:00 UTC (not shown here to keep example concise)
resource "aws_cloudwatch_event_rule" "daily_backtest_rule" {
  name                = "${var.project_name}-daily-backtests"
  description         = "Trigger ECS daily for rule-based backtests"
  schedule_expression = "cron(0 1 * * ? *)" # 01:00 AM UTC everyday
}

resource "aws_cloudwatch_event_target" "daily_backtest_target" {
  rule     = aws_cloudwatch_event_rule.daily_backtest_rule.name
  target_id = "run-daily-backtests"
  arn      = aws_ecs_cluster.quant_cluster.arn
  role_arn = aws_iam_role.eventbridge_role.arn

  ecs_target {
    task_definition_arn = aws_ecs_task_definition.ml_jobs.arn
    task_count          = 1
    launch_type         = "FARGATE"
    
    network_configuration {
      subnets          = aws_subnet.public[*].id
      security_groups  = [aws_security_group.lambda_sg.id]
      assign_public_ip = true
    }
  }
  
  # Override CMD for Daily Job
  input = jsonencode({
    containerOverrides = [
      {
        name = "quant-job"
        command = ["bash", "scripts/daily_job.sh"]
      }
    ]
  })
}

# 2. WEEKLY JOB: ML Pipeline Training (02:00 UTC every Sunday)
resource "aws_cloudwatch_event_rule" "weekly_ml_rule" {
  name                = "${var.project_name}-weekly-ml"
  description         = "Trigger ECS weekly for ML Training"
  schedule_expression = "cron(0 2 ? * SUN *)" # 02:00 AM UTC every Sunday
}

resource "aws_cloudwatch_event_target" "weekly_ml_target" {
  rule     = aws_cloudwatch_event_rule.weekly_ml_rule.name
  target_id = "run-weekly-ml"
  arn      = aws_ecs_cluster.quant_cluster.arn
  role_arn = aws_iam_role.eventbridge_role.arn

  ecs_target {
    task_definition_arn = aws_ecs_task_definition.ml_jobs.arn
    task_count          = 1
    launch_type         = "FARGATE"
    
    network_configuration {
      subnets          = aws_subnet.public[*].id
      security_groups  = [aws_security_group.lambda_sg.id]
      assign_public_ip = true
    }
  }
  
  # Override CMD for Weekly Job
  input = jsonencode({
    containerOverrides = [
      {
        name = "quant-job"
        command = ["bash", "scripts/weekly_job.sh"]
      }
    ]
  })
}
