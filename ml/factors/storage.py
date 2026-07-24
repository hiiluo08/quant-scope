from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

from data_pipeline.storage.local_store import FACTORS_DIR
from ml.factors.base import FACTOR_OUTPUT_COLUMNS, Factor, prepare_factor_input

def factor_values_path(factor_name: str, root: Path = FACTORS_DIR) -> Path:
    return root / f"factor_name={factor_name}" / "values.parquet"

def build_factor_frame(factor: Factor, source: pd.DataFrame) -> pd.DataFrame:
    prepared = prepare_factor_input(source)
    values = factor.compute(prepared)
    if len(values) != len(prepared):
        raise ValueError(f"Factor {factor.name} returned {len(values)} values for {len(prepared)} rows")
    
    result = prepared[["date", "symbol"]].copy()
    result["factor_name"] = factor.name
    result["factor_value"] = values.to_numpy()
    result["factor_version"] = factor.version
    result["computed_at"] = datetime.now(timezone.utc).isoformat()
    
    return result[FACTOR_OUTPUT_COLUMNS]

def _validate_factor_frame(df: pd.DataFrame) -> None:
    if list(df.columns) != FACTOR_OUTPUT_COLUMNS:
        raise ValueError(f"Factor output schema must be exactly {FACTOR_OUTPUT_COLUMNS}")
    
    if df.duplicated(["date", "symbol", "factor_name", "factor_version"]).any():
        raise ValueError("Factor output contains duplicate logical keys")
    
    if df["factor_name"].nunique() != 1:
        raise ValueError("One Parquet file must contain exactly one factor name")
    
def save_factor_values(df: pd.DataFrame, factor_name: str, root: Path = FACTORS_DIR) -> Path:
    _validate_factor_frame(df)
    if set(df["factor_name"]) != {factor_name}:
        raise ValueError(f"factor_name argument doesn not match factor output")
    path = factor_values_path(factor_name, root)
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(path, index=False)
    return path

def load_factor_values(factor_name: str, root: Path = FACTORS_DIR) -> pd.DataFrame:
    path = factor_values_path(factor_name, root)
    if not path.exists():
        raise FileNotFoundError(f"Stored factor output not found: {factor_name}")
    
    result = pd.read_parquet(path)
    _validate_factor_frame(result)
    return result