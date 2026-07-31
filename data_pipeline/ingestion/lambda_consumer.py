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


def _read_parquet_s3(bucket: str, key: str) -> pd.DataFrame:
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        buf = io.BytesIO(response["Body"].read())
        return pd.read_parquet(buf)
    except s3.exceptions.NoSuchKey:
        return pd.DataFrame()
    except Exception as e:
        logger.error(f"Error reading {key} from S3: {e}")
        return pd.DataFrame()

def lambda_handler(event: dict, context: object) -> dict:
    from data_pipeline.processing.normalize import normalize_ohlcv
    
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

            # Write quarantined data
            if not quarantined.empty:
                q_key = f"data/quarantine/{end_date}/chunk_{chunk_id:03d}.parquet"
                _upload_parquet(quarantined, bucket, q_key)

            # Process clean data by symbol
            if not clean.empty:
                normalized = normalize_ohlcv(clean)
                
                for symbol, group in normalized.groupby("symbol"):
                    s3_key = f"data/processed/symbol={symbol}/data.parquet"
                    existing_df = _read_parquet_s3(bucket, s3_key)
                    
                    if not existing_df.empty:
                        combined = pd.concat([existing_df, group], ignore_index=True)
                        combined = combined.drop_duplicates(subset=["date"], keep="last")
                        combined = combined.sort_values(by="date").reset_index(drop=True)
                    else:
                        combined = group.sort_values(by="date").reset_index(drop=True)
                        
                    _upload_parquet(combined, bucket, s3_key)

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
