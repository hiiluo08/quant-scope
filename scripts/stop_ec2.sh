#!/bin/bash
# QuantScope — EC2 Stop Runbook Script
# Tắt máy chủ EC2 khi hoàn tất demo để tiết kiệm chi phí

AWS_REGION="${AWS_REGION:-ap-southeast-1}"
INSTANCE_ID=$(aws ec2 describe-instances \
  --region "$AWS_REGION" \
  --filters "Name=tag:Name,Values=quantscope-ec2-demo" "Name=instance-state-name,Values=running" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text 2>/dev/null)

if [ -n "$INSTANCE_ID" ] && [ "$INSTANCE_ID" != "None" ]; then
  echo "Tắt máy chủ EC2 ID: $INSTANCE_ID..."
  aws ec2 stop-instances --instance-ids "$INSTANCE_ID" --region "$AWS_REGION"
  echo "Đã gửi lệnh tắt EC2 thành công để dừng tính phí compute!"
else
  echo "Không tìm thấy máy chủ quantscope-ec2-demo đang running."
fi
