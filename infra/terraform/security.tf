# Security Group for Lambda Functions in VPC (nếu cần truy cập VPC sau này)
resource "aws_security_group" "lambda_sg" {
  name        = "${var.project_name}-lambda-sg"
  description = "Security group for Lambda functions in VPC"
  vpc_id      = aws_vpc.main.id

  egress {
    description = "Allow all outbound traffic to NAT Gateway / VPC Endpoints"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-lambda-sg"
  }
}
