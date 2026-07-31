import os
import boto3
from pathlib import Path

def upload_directory_to_s3(bucket: str, local_dir: str, s3_prefix: str):
    s3 = boto3.client("s3", region_name=os.environ.get("AWS_REGION", "ap-southeast-1"))
    local_path = Path(local_dir)
    if not local_path.exists():
        print(f"Directory {local_dir} does not exist. Nothing to upload.")
        return
        
    for file_path in local_path.rglob("*"):
        if file_path.is_file():
            # Use as_posix() to ensure forward slashes on Windows just in case
            relative_path = file_path.relative_to(local_path).as_posix()
            s3_key = f"{s3_prefix}/{relative_path}"
            print(f"Uploading {file_path} to s3://{bucket}/{s3_key}")
            s3.upload_file(str(file_path), bucket, s3_key)

if __name__ == "__main__":
    bucket = os.environ.get("BUCKET_NAME")
    if bucket:
        print(f"Syncing data to bucket {bucket}")
        upload_directory_to_s3(bucket, "data", "data")
    else:
        print("BUCKET_NAME not set. Skipping S3 sync.")
