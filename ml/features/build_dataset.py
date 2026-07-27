from __future__ import annotations

from pathlib import Path

import pandas as pd

from data_pipeline.storage.local_store import FACTORS_DIR
from ml.factors.storage import load_factor_values

FEATURE_COLUMNS = (
    "momentum_20d", "momentum_60d", "volatility_20d", "rsi_14",
    "sma_ratio_20_50", "volume_zscore_20d"
)
TARGET_COLUMNS = "forward_return_5d"

def build_feature_dataset(labels: pd.DataFrame, factors_root: Path = FACTORS_DIR) -> tuple[pd.DataFrame, dict[str, str]]:
    required = {"date", "symbol", TARGET_COLUMNS}
    missing = sorted(required - set(labels.columns))
    if missing:
        raise ValueError(f"labels is missing required columns: {', '.join(missing)}")
    labels = labels[["date", "symbol", TARGET_COLUMNS]].copy()
    labels["date"] = pd.to_datetime(labels["date"])
    if labels.duplicated(["date", "symbol"]).any():
        raise ValueError("labels contains duplicate date and symbol rows")
    
    frames: list[pd.DataFrame] = []
    versions: dict[str, str] = {}
    for name in FEATURE_COLUMNS:
        factor = load_factor_values(name, root=factors_root)
        unique_versions = factor["factor_version"].dropna().unique().tolist()
        if len(unique_versions) != 1:
            raise ValueError(f"factor {name} must have exactly one version")
        versions[name] = str(unique_versions[0])
        values = factor[["date", "symbol", "factor_value"]].rename(columns={"factor_value": name})
        if values.duplicated(["date", "symbol"]).any():
            raise ValueError(f"factor {name} contains duplicate date and symbol rows")
        frames.append(values)
        
    features = frames[0]
    for frame in frames[1:]:
        features = features.merge(frame, on=["date", "symbol"], how="outer", validate="one_to_one")
    
    dataset = features.merge(labels, on=["date", "symbol"], how="inner", validate="one_to_one")
    dataset = dataset.dropna(subset=[*FEATURE_COLUMNS, TARGET_COLUMNS])
    dataset = dataset.sort_values(["date", "symbol"]).reset_index(drop=True)
    return dataset[["date", "symbol", *FEATURE_COLUMNS, TARGET_COLUMNS]], versions