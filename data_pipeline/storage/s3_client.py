import boto3
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class S3Client:
    def __init__(self, bucket_name: str | None = None, region: str | None = None):
        self.bucket = bucket_name or os.environ.get("S3_BUCKET_NAME")
        self.region = region or os.environ.get("AWS_REGION", "us-east-1")
        self.client = boto3.client("s3", region_name=self.region)
    
    def upload_file(self, local_path: str | Path, s3_key: str) -> None:
        local_path = Path(local_path)
        logger.info(f"Uploading {local_path} to s3://{self.bucket}/{s3_key}")
        self.client.upload_file(str(local_path), self.bucket, s3_key)
        
    def download_file(self, s3_key: str, local_path: str | Path) -> None:
        local_path = Path(local_path)
        local_path.parent.mkdir(parents=True, exist_ok=True)
        logger.info(f"Downloading s3://{self.bucket}/{s3_key} to {local_path}")
        self.client.download_file(self.bucket, s3_key, str(local_path))
    
    def list_keys(self, prefix: str = "") -> list[str]:
        """ List all S3 keys under a prefix. """
        paginator = self.client.get_paginator("list_objects_v2")
        
        keys = []
        for page in paginator.paginate(Bucket=self.bucket, Prefix=prefix):
            for obj in page.get("Contents", []):
                keys.append(obj["Key"])
        
        return keys
    
    def upload_dataframe_as_parquet(self, df, s3_key: str, tmp_path: str = "/tmp/upload.parquet") -> None:
        """ Upload a DataFrame directly to S3 as Parquet via temp file. """
        import pandas as pd
        df.to_parquet(tmp_path, index=False)
        self.upload_file(tmp_path, s3_key)
        
    def download_parquet_as_dataframe(self, s3_key: str, tmp_path: str = "/tmp/download.parquet"):
        """ Download a Parquet file from S3 and return as DataFrame. """
        import pandas as pd
        self.download_file(s3_key, tmp_path)
        return pd.read_parquet(tmp_path)


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    s3 = S3Client()
    
    print(f"Testing S3 connection to bucket: {s3.bucket}")
    keys = s3.list_keys(prefix="processed/")
    print(f"Files in processed/: {keys}")
    start, end = "20220101", "20241231"
    
    test_file = Path(f"data/processed/ohlcv_{start}_{end}.parquet")
    if test_file.exists():
        s3.upload_file(test_file, f"processed/ohlcv_{start}_{end}.parquet")
        print("Upload success")
    else:
        print(f"No processed data to upload. Run normalize.py first.")