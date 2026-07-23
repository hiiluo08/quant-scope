from pathlib import Path
import pandas as pd

DATA_ROOT = Path('data')
RAW_DIR = DATA_ROOT / 'raw'
PROCESSED_DIR = DATA_ROOT / 'processed'
FACTORS_DIR = DATA_ROOT / 'factors'
ARTIFACTS_DIR = DATA_ROOT / 'artifacts'

def ensure_dir() -> None:
    """ Create all data directories if they don't exist. """
    for d in [RAW_DIR, PROCESSED_DIR, FACTORS_DIR, ARTIFACTS_DIR / 'models', ARTIFACTS_DIR / 'backtests']:
        d.mkdir(parents=True, exist_ok=True)

def raw_path(source: str, start: str, end: str) -> Path:
    return RAW_DIR / f'source={source}' / f'prices_{start}_{end}.parquet'

def processed_path(start: str, end: str, base_dir: str | Path = "data/processed") -> Path:
    start_str = start.replace("-", "")
    end_str = end.replace("-", "")
    return Path(base_dir) / f"ohlcv_{start_str}_{end_str}.parquet"

def load_processed(start: str, end: str) -> pd.DataFrame | None:
    path = processed_path(start, end)
    if path.exists():
        return pd.read_parquet(path)
    return None

# S3 key conventions (add to local_store.py)
def s3_raw_key(source: str, start: str, end: str) -> str:
    return f"raw/source={source}/prices_{start}_{end}.parquet"

def s3_processed_key(start: str, end: str) -> str:
    return f"processed/ohlcv_{start}_{end}.parquet"
    
