from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

from data_pipeline.ingestion.download import download_multiple_tickers
from data_pipeline.processing.normalize import normalize_ohlcv, save_parquet
from data_pipeline.processing.validate import validate_ohlcv
from data_pipeline.storage.local_store import ensure_dir, universe_processed_path

UNIVERSE_TICKERS = (
    "SPY", "QQQ", "DIA", "IWM", "XLK", "XLF", "XLE", "XLV", "XLY", "XLP",
    "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "JPM", "BAC", "JNJ",
    "UNH", "XOM", "CVX", "WMT", "COST", "PG", "KO", "HD", "DIS", "NFLX",
)

MIN_TRADING_ROWS = 504

def _validate_universe(df: pd.DataFrame) -> None:
    observed = set(df["symbol"].unique())
    missing = sorted(set(UNIVERSE_TICKERS) - observed)
    unexpected = sorted(observed - set(UNIVERSE_TICKERS))
    
    if missing:
        raise ValueError(f"Missing symbols: {', '.join(missing)}")
    
    if unexpected:
        raise ValueError(f"Unexpected symbols: {', '.join(unexpected)}")
    
    row_counts = df.groupby("symbol")["date"].nunique()
    short_symbols = row_counts[row_counts < MIN_TRADING_ROWS]
    if not short_symbols.empty:
        details = ", ".join(f"{name}={count}" for name, count in short_symbols.items())
        
        raise ValueError(f"Every symbol needs at least {MIN_TRADING_ROWS} trading rows; {details}")

def _validate_quality(report: dict[str, object]) -> None:
    blocking = {
        key: value for key, value in report.items() 
        if key in {"missing_values", "duplicate_rows", "negative_or_zero_price"} and value
    }
    
    if blocking:
        raise ValueError(f"Processed OHLCV quality checks failed: {blocking}")
    
def rebuild_universe(start_date: str, end_date: str, output_path: Path | None = None) -> pd.DataFrame:
    """ Build and persist the complete fixed research universe. """
    ensure_dir()
    raw = download_multiple_tickers(list(UNIVERSE_TICKERS), start_date, end_date)
    processed = normalize_ohlcv(raw)
    _validate_universe(processed)
    _validate_quality(validate_ohlcv(processed))

    destination = output_path or universe_processed_path(start_date, end_date)
    save_parquet(processed, destination)
    
    return processed

def main() -> None:
    parser = argparse.ArgumentParser(description="Rebuild the 30-symbol QuantScope universe")
    parser.add_argument("--start-date", required=True, help="Inclusive start date, YYYY-MM-DD")
    parser.add_argument("--end-date", required=True, help="Exclusive end date, YYYY-MM-DD")
    args = parser.parse_args()
    
    result = rebuild_universe(args.start_date, args.end_date)
    print(f"Saved {len(result):,} processed rows for {result['symbol'].nunique()} symbols")
    

if __name__ == "__main__":
    main()