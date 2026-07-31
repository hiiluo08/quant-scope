from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from backend.app.core.config import settings

import os
import boto3
from pathlib import Path
import logging

import os
import boto3
from pathlib import Path
import logging
from fastapi import Request

logger = logging.getLogger(__name__)

_s3_synced = False

def ensure_s3_data():
    global _s3_synced
    if _s3_synced: return
    
    bucket = os.environ.get("BUCKET_NAME")
    if not bucket: return
    
    logger.info("Syncing S3 data to /tmp on first request...")
    s3 = boto3.client("s3")
    paginator = s3.get_paginator('list_objects_v2')
    
    if "data/" in settings.processed_file and not settings.processed_file.startswith("/tmp"):
        settings.processed_file = settings.processed_file.replace("data/", "/tmp/data/")
        settings.factors_dir = settings.factors_dir.replace("data/", "/tmp/data/")
        settings.backtests_dir = settings.backtests_dir.replace("data/", "/tmp/data/")
        settings.models_dir = settings.models_dir.replace("data/", "/tmp/data/")
    
    try:
        for page in paginator.paginate(Bucket=bucket, Prefix="data/"):
            for obj in page.get("Contents", []):
                key = obj["Key"]
                if key.endswith("/"): continue
                local_path = Path("/tmp") / key
                if not local_path.exists():
                    local_path.parent.mkdir(parents=True, exist_ok=True)
                    s3.download_file(bucket, key, str(local_path))
        _s3_synced = True
        logger.info("S3 sync complete.")
    except Exception as e:
        logger.error(f"Failed to sync S3 to tmp: {e}")

from backend.app.api.routes_backtests import router as backtests_router
from backend.app.api.routes_factors import router as factors_router
from backend.app.api.routes_market_data import router as market_data_router
from backend.app.api.routes_models import router as models_router

app = FastAPI(title="QuantScope API", version="0.2.0")

@app.middleware("http")
async def ensure_data_middleware(request: Request, call_next):
    if os.environ.get("APP_ENV") == "production":
        ensure_s3_data()
    return await call_next(request)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins (handled by API Gateway as well)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market_data_router, prefix="/api/v1")
app.include_router(factors_router, prefix="/api/v1")
app.include_router(backtests_router, prefix="/api/v1")
app.include_router(models_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok", "service": "quantscope-api"}

# Handler cho AWS Lambda
handler = Mangum(app)