"""Lambda Producer: reads tickers from S3 config, sends chunked SQS messages."""
import os
import json
import logging
from datetime import datetime, timezone, timedelta

import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

CHUNK_SIZE = 25  # symbols per SQS message


def lambda_handler(event: dict, context: object) -> dict:
    bucket = os.environ["S3_BUCKET_NAME"]
    queue_url = os.environ["SQS_QUEUE_URL"]

    s3 = boto3.client("s3")
    sqs = boto3.client("sqs")

    # 1. Load tickers from S3 config
    config_obj = s3.get_object(Bucket=bucket, Key="config/tickers.json")
    config = json.loads(config_obj["Body"].read())
    all_symbols = []
    for sector_data in config["sectors"].values():
        all_symbols.extend(sector_data["symbols"])
    symbols = list(dict.fromkeys(all_symbols))  # dedupe, preserve order

    # 2. Compute date range
    end_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    start_date = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")

    # 3. Send chunked messages
    chunks = [symbols[i : i + CHUNK_SIZE] for i in range(0, len(symbols), CHUNK_SIZE)]
    for i, chunk in enumerate(chunks):
        sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps({
                "chunk_id": i,
                "symbols": chunk,
                "start_date": start_date,
                "end_date": end_date,
                "bucket": bucket,
            }),
        )

    logger.info(f"Dispatched {len(chunks)} chunks for {len(symbols)} symbols")
    return {
        "status": "success",
        "total_symbols": len(symbols),
        "chunks_sent": len(chunks),
        "chunk_size": CHUNK_SIZE,
    }
