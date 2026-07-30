resource "aws_s3_bucket" "data_lake" {
  bucket_prefix = "${var.project_name}-data-"
  force_destroy = true
}

resource "aws_s3_bucket_lifecycle_configuration" "data_lake_lifecycle" {
  bucket = aws_s3_bucket.data_lake.id

  rule {
    id     = "expire-raw-data"
    status = "Enabled"
    
    filter {
      prefix = "raw/"
    }

    expiration {
      days = 365
    }
  }

  rule {
    id     = "expire-quarantine-data"
    status = "Enabled"

    filter {
      prefix = "quarantine/"
    }

    expiration {
      days = 365
    }
  }
}

output "data_bucket_name" {
  value = aws_s3_bucket.data_lake.bucket
}
