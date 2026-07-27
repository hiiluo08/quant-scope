from __future__ import annotations

import hashlib
import json
from pathlib import Path

import pandas as pd

from data_pipeline.storage.local_store import BACKTESTS_DIR
from ml.backtesting.engine import DAILY_RESULT_COLUMNS

REQUIRED_METADATA_KEYS = {
    "strategy_name", "engine_version", "start_date", "end_date", "factor_versions",
    "transaction_cost_bps", "slippage_bps", "initial_equity", "metrics", "benchmarks"
}

def build_backtest_id(metadata: dict[str, object]) -> str:
    payload = json.dumps(metadata, sort_keys=True, separators=(",", ":"), default=str)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]

def _validate_daily_results(frame: pd.DataFrame) -> None:
    if list(frame.columns) != DAILY_RESULT_COLUMNS:
        raise ValueError(f"daily results schema must be exactly {DAILY_RESULT_COLUMNS}")
    if frame["date"].duplicated().any():
        raise ValueError("daily results contains duplicate dates")
    
def _validate_metadata(metadata: dict[str, object]) -> None:
    missing = REQUIRED_METADATA_KEYS - set(metadata.keys())
    if missing:
        raise ValueError(f"metadata is missing required keys: {', '.join(missing)}")
    
def result_path(backtest_id: str, root: Path = BACKTESTS_DIR) -> Path:
    return root / f"backtest_id={backtest_id}"

def save_backtest_result(daily_results: pd.DataFrame, metadata: dict[str, object], root: Path = BACKTESTS_DIR) -> Path:
    _validate_daily_results(daily_results)
    _validate_metadata(metadata)
    result_metadata = dict(metadata)
    result_metadata["backtest_id"] = build_backtest_id(metadata)
    destination = result_path(result_metadata["backtest_id"], root=root)
    destination.mkdir(parents=True, exist_ok=True)
    daily_results.to_parquet(destination / "daily_results.parquet", index=False)
    (destination / "metadata.json").write_text(
        json.dumps(result_metadata, indent=2, sort_keys=True, default=str) + "\n",
        encoding="utf-8"
    )
    return destination

def load_backtest_result(backtest_id: str, root: Path = BACKTESTS_DIR) -> tuple[dict[str, object], pd.DataFrame]:
    folder = result_path(backtest_id, root=root)
    metadata_path = folder / "metadata.json"
    daily_path = folder / "daily_results.parquet"
    if not metadata_path.exists() or not daily_path.exists():
        raise FileNotFoundError(f"Stored backtest result not found: {backtest_id}")
    
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    if metadata.get("backtest_id") != backtest_id:
        raise ValueError(f"Stored metedata backtest_id does not match directory")
    
    _validate_metadata(metadata)
    daily = pd.read_parquet(daily_path)
    _validate_daily_results(daily)
    
    return metadata, daily

def list_backtests(root: Path = BACKTESTS_DIR) -> list[dict[str, object]]:
    if not root.exists():
        return []
    
    results: list[dict[str, object]] = []
    for metadata_path in sorted(root.glob("backtest_id=*/metadata.json")):
        metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
        _validate_metadata(metadata)
        results.append(metadata)
    
    return results