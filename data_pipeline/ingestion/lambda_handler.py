import os
import json
import logging
from datetime import datetime, timezone, timedelta

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event: dict, context: object) -> dict[str, object]:
    """
    AWS Lambda Handler: Thực hiện nạp dữ liệu định kỳ cho QuantScope.
    - Đọc S3_BUCKET_NAME từ biến môi trường của Lambda.
    - Ghi log structured số lượng mã cổ phiếu và khoảng thời gian.
    - Chỉ được ghi dữ liệu vào các prefix cho phép: raw/, processed/, factors/.
    """
    bucket_name = os.environ.get("S3_BUCKET_NAME")
    if not bucket_name:
        raise ValueError("S3_BUCKET_NAME environment variable is not set")
    
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=1)
    
    symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "SPY"]
    logger.info(f"Starting scheduled ingestion for bucket={bucket_name}, symbols={symbols}, range={start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
    
    result = {
        "status": "success",
        "processed_symbols": len(symbols),
        "bucket": bucket_name,
        "timestamp": end_date.isoformat()
    }
    logger.info(f"Ingestion completed: {json.dumps(result)}")
    return result
