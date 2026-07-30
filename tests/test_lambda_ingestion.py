"""Tests for Lambda producer and consumer modules (mocking boto3 and yfinance)."""
import json
import pytest
from unittest.mock import MagicMock, patch
import pandas as pd

from data_pipeline.ingestion.lambda_producer import lambda_handler as producer_handler
from data_pipeline.ingestion.lambda_consumer import lambda_handler as consumer_handler


def test_lambda_producer_dispatches_sqs_messages():
    mock_s3 = MagicMock()
    fake_config = {
        "sectors": {
            "tech": {"symbols": [f"SYM_{i}" for i in range(50)]}
        }
    }
    mock_s3.get_object.return_value = {
        "Body": MagicMock(read=lambda: json.dumps(fake_config).encode("utf-8"))
    }
    mock_sqs = MagicMock()

    with patch("boto3.client") as mock_boto:
        def boto_client_side_effect(service, **kwargs):
            if service == "s3":
                return mock_s3
            elif service == "sqs":
                return mock_sqs
            return MagicMock()

        mock_boto.side_effect = boto_client_side_effect
        with patch.dict("os.environ", {"S3_BUCKET_NAME": "test-bucket", "SQS_QUEUE_URL": "http://sqs.test"}):
            res = producer_handler({}, None)
            assert res["status"] == "success"
            assert res["total_symbols"] == 50
            assert res["chunks_sent"] == 2  # 50 symbols / 25 chunk_size
            assert mock_sqs.send_message.call_count == 2


def test_lambda_consumer_processes_event():
    mock_s3 = MagicMock()

    fake_df = pd.DataFrame([{
        "date": pd.Timestamp("2024-01-15"),
        "symbol": "AAPL",
        "open": 150.0,
        "high": 155.0,
        "low": 148.0,
        "close": 153.0,
        "adjusted_close": 153.0,
        "volume": 1_000_000,
        "source": "yfinance",
        "ingested_at": "2024-01-15T22:00:00+00:00",
    }])

    sqs_event = {
        "Records": [
            {
                "body": json.dumps({
                    "chunk_id": 0,
                    "symbols": ["AAPL"],
                    "start_date": "2024-01-14",
                    "end_date": "2024-01-15",
                    "bucket": "test-bucket",
                })
            }
        ]
    }

    with patch("data_pipeline.ingestion.lambda_consumer.s3", mock_s3):
        with patch("data_pipeline.ingestion.lambda_consumer.download_multiple_tickers", return_value=fake_df):
            res = consumer_handler(sqs_event, None)
            assert res["status"] == "success"
            assert len(res["results"]) == 1
            assert res["results"][0]["status"] == "success"
            assert res["results"][0]["passed"] == 1
            assert mock_s3.put_object.call_count == 1

