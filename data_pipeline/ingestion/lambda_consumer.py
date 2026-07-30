"""Lambda Consumer: processes SQS messages, downloads data, runs quality gate."""
import json
import logging
import io

import boto3
import pandas as pd

from data_pipeline.ingestion.download import download_multiple_tickers
from data_pipeline.processing.quality_gate import run_quality_gate

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client("s3")


def _upload_parquet(df: pd.DataFrame, bucket: str, key: str) -> None:
    """Write DataFrame as Parquet to S3."""
    buf = io.BytesIO()
    df.to_parquet(buf, index=False)
    buf.seek(0)
    s3.put_object(Bucket=bucket, Key=key, Body=buf.getvalue())


def lambda_handler(event: dict, context: object) -> dict:
    results = []

    for record in event["Records"]:
        payload = json.loads(record["body"])
        chunk_id = payload["chunk_id"]
        symbols = payload["symbols"]
        start_date = payload["start_date"]
        end_date = payload["end_date"]
        bucket = payload["bucket"]

        logger.info(f"Chunk {chunk_id}: processing {len(symbols)} symbols")

        try:
            raw_df = download_multiple_tickers(symbols, start_date, end_date)
            clean, quarantined, report = run_quality_gate(raw_df)

            # Write clean data
            if not clean.empty:
                key = f"raw/daily/{end_date}/chunk_{chunk_id:03d}.parquet"
                _upload_parquet(clean, bucket, key)

            # Write quarantined data
            if not quarantined.empty:
                q_key = f"quarantine/{end_date}/chunk_{chunk_id:03d}.parquet"
                _upload_parquet(quarantined, bucket, q_key)

            results.append({
                "chunk_id": chunk_id,
                "status": "success",
                "passed": report.passed_rows,
                "quarantined": report.quarantined_rows,
            })

        except Exception as exc:
            logger.error(f"Chunk {chunk_id} failed: {exc}")
            results.append({"chunk_id": chunk_id, "status": "error", "error": str(exc)})

    logger.info(f"Consumer finished: {json.dumps(results)}")
    return {"status": "success", "results": results}
