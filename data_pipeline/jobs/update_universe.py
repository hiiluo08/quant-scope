from __future__ import annotations

import argparse
import logging
from pathlib import Path

import pandas as pd

from backend.app.core.config import settings
from data_pipeline.ingestion.download import download_multiple_tickers
from data_pipeline.jobs.rebuild_universe import UNIVERSE_TICKERS, _validate_quality, compute_and_store_default_factors
from data_pipeline.processing.normalize import normalize_ohlcv, save_parquet
from data_pipeline.processing.quality_gate import run_quality_gate
from data_pipeline.processing.validate import validate_ohlcv
from data_pipeline.storage.local_store import ensure_dir

logger = logging.getLogger(__name__)

def update_universe(existing_path: Path, end_date: str) -> pd.DataFrame:
    """ Append new data to an existing universe dataset. """
    ensure_dir()
    
    if not existing_path.exists():
        logger.error(f"Existing dataset not found at {existing_path}. Please run rebuild_universe first.")
        raise FileNotFoundError(f"Missing {existing_path}")

    existing_df = pd.read_parquet(existing_path)
    existing_df['date'] = pd.to_datetime(existing_df['date'])
    
    start_date = existing_df['date'].max().strftime("%Y-%m-%d")
    logger.info(f"Existing data goes up to {start_date}. Fetching new data from {start_date} to {end_date}...")
    
    if start_date >= end_date:
        logger.info("Dataset is already up to date.")
        return existing_df

    raw_new = download_multiple_tickers(list(UNIVERSE_TICKERS), start_date, end_date)
    
    if raw_new.empty:
        logger.info("No new data downloaded (maybe market was closed or symbols unchanged).")
        return existing_df
        
    clean_new, quarantined, _ = run_quality_gate(raw_new)
    if not quarantined.empty:
        logger.warning(f"Quarantined {len(quarantined)} new rows. Check logs.")
        
    processed_new = normalize_ohlcv(clean_new)
    
    # Merge new data and deduplicate
    combined = pd.concat([existing_df, processed_new], ignore_index=True)
    combined = combined.drop_duplicates(subset=["symbol", "date"], keep="last")
    combined = combined.sort_values(by=["symbol", "date"]).reset_index(drop=True)
    
    _validate_quality(validate_ohlcv(combined))
    
    save_parquet(combined, existing_path)
    logger.info(f"Appended {len(processed_new)} new rows. Total rows now {len(combined)}.")
    
    return combined

def main() -> None:
    parser = argparse.ArgumentParser(description="Incrementally update the QuantScope universe")
    parser.add_argument("--end-date", required=True, help="Exclusive end date to update up to, YYYY-MM-DD")
    parser.add_argument(
        "--compute-factors",
        action="store_true",
        help="Persist the default factor set after a successful update",
    )
    args = parser.parse_args()
    
    target_file = Path(settings.processed_file)
    result = update_universe(target_file, args.end_date)
    
    if args.compute_factors:
        paths = compute_and_store_default_factors(target_file)
        print(f"Saved {len(paths)} factor files")
        
    print(f"Saved {len(result):,} processed rows for {result['symbol'].nunique()} symbols")

if __name__ == "__main__":
    main()
