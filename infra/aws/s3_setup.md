# S3 Setup Notes

## Bucket naming

Bucket: `quantscope-data-dev-942852434802-ap-southeast-1-an`
Region: `ap-southeast-1`

## Access

IAM user `quantscope-dev` has `AmazonS3FullAccess` for dev environment.
Week 7 will refine to least privilege using custom IAM policy.

## Folder structure

raw/source=yfinance/    # raw OHLCV Parquet
processed/              # normalized OHLCV
factors/                # computed factor values
artifacts/models/       # trained ML models
artifacts/backtests/    # backtest result JSON

## Cost estimate

S3 Standard us-east-1: ~$0.023/GB-month.
For 5 GB of data: ~$0.12/month.

## Security reminders

- Never make data bucket public.
- Never commit AWS keys.
- Set S3 lifecycle policy to expire temp test files after 30 days.