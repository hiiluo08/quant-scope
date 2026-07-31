from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path

import pandas as pd

from data_pipeline.ingestion.download import download_multiple_tickers
from data_pipeline.processing.normalize import normalize_ohlcv, save_parquet
from data_pipeline.processing.validate import validate_ohlcv
from data_pipeline.processing.quality_gate import run_quality_gate
from data_pipeline.storage.local_store import ensure_dir, universe_processed_path

logger = logging.getLogger(__name__)

TICKERS_CONFIG_PATH = Path("data/config/tickers.json")

def load_universe_tickers(config_path: Path = TICKERS_CONFIG_PATH) -> tuple[str, ...]:
    """Load ticker universe from tickers.json config file."""
    with open(config_path) as f:
        config = json.load(f)
    all_symbols: list[str] = []
    for sector_data in config["sectors"].values():
        all_symbols.extend(sector_data["symbols"])
    # Deduplicate while preserving order
    seen: set[str] = set()
    unique: list[str] = []
    for s in all_symbols:
        if s not in seen:
            seen.add(s)
            unique.append(s)
    return tuple(unique)

UNIVERSE_TICKERS = load_universe_tickers()

MIN_TRADING_ROWS = 252

def _validate_universe(df: pd.DataFrame) -> None:
    observed = set(df["symbol"].unique())
    missing = sorted(set(UNIVERSE_TICKERS) - observed)
    unexpected = sorted(observed - set(UNIVERSE_TICKERS))
    
    if missing:
        logger.warning(f"Missing symbols: {', '.join(missing)}")
    
    if unexpected:
        raise ValueError(f"Unexpected symbols: {', '.join(unexpected)}")
    
    row_counts = df.groupby("symbol")["date"].nunique()
    short_symbols = row_counts[row_counts < MIN_TRADING_ROWS]
    if not short_symbols.empty:
        details = ", ".join(f"{name}={count}" for name, count in short_symbols.items())
        logger.warning(f"Every symbol needs at least {MIN_TRADING_ROWS} trading rows; {details}")

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
    
    # Quality Gate: filter bad data before normalization
    clean_raw, quarantined, qg_report = run_quality_gate(raw)
    if not quarantined.empty:
        q_path = (output_path or universe_processed_path(start_date, end_date)).parent
        q_path = q_path / "quarantine" / f"quarantine_{start_date}_{end_date}.parquet"
        q_path.parent.mkdir(parents=True, exist_ok=True)
        quarantined.to_parquet(q_path, index=False)
        logger.info(f"Quarantined {len(quarantined)} rows -> {q_path}")

    processed = normalize_ohlcv(clean_raw)
    _validate_universe(processed)
    _validate_quality(validate_ohlcv(processed))

    destination = output_path or universe_processed_path(start_date, end_date)
    save_parquet(processed, destination)
    
    return processed

def compute_and_store_default_factors(
    processed_path: Path,
    factors_root: Path | None = None,
) -> list[Path]:
    """Compute and persist every default factor for an existing processed snapshot."""
    from data_pipeline.storage.local_store import FACTORS_DIR
    from ml.factors.registry import build_default_registry
    from ml.factors.storage import save_factor_values

    source = pd.read_parquet(processed_path)
    results = build_default_registry().compute_all(source)
    root = factors_root or FACTORS_DIR
    return [save_factor_values(frame, name, root=root) for name, frame in results.items()]

def main() -> None:
    parser = argparse.ArgumentParser(description="Rebuild the 30-symbol QuantScope universe")
    parser.add_argument("--start-date", required=True, help="Inclusive start date, YYYY-MM-DD")
    parser.add_argument("--end-date", required=True, help="Exclusive end date, YYYY-MM-DD")
    parser.add_argument(
        "--compute-factors",
        action="store_true",
        help="Persist the default factor set after a successful universe rebuild",
    )
    args = parser.parse_args()
    
    result = rebuild_universe(args.start_date, args.end_date)
    output = universe_processed_path(args.start_date, args.end_date)
    if args.compute_factors:
        paths = compute_and_store_default_factors(output)
        print(f"Saved {len(paths)} factor files")
    print(f"Saved {len(result):,} processed rows for {result['symbol'].nunique()} symbols")


if __name__ == "__main__":
    main()