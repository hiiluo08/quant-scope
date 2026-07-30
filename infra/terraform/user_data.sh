#!/bin/bash
# 1. Update and install Docker
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker

# 2. Add ec2-user to docker group
usermod -a -G docker ec2-user

# 3. Authenticate Docker to Amazon ECR
aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${ecr_url}

# 4. Pull the latest image
docker pull ${ecr_url}:latest

# 5. Run the container
docker run -d -p 8000:8000 --restart always --name quantscope-api ${ecr_url}:latest
