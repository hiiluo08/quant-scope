from __future__ import annotations

import hashlib
import json
from pathlib import Path

import lightgbm as lgb
import pandas as pd
import xgboost as xgb

from data_pipeline.storage.local_store import ARTIFACTS_DIR

MODELS_DIR = ARTIFACTS_DIR / "models"

def build_model_id(manifest: dict[str, object]) -> str:
    payload = json.dumps(manifest, sort_keys=True, separators=(",", ":"), default=str)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]

def model_path(model_id: str, root: Path = MODELS_DIR) -> Path:
    return root / f"model_id={model_id}"

def save_model_artifact(trained: object, manifest: dict[str, object], root: Path = MODELS_DIR) -> Path:
    required = {"family", "feature_columns", "factor_versions", "label", "split_dates", "parameters", "metrics"}
    missing = sorted(required - set(manifest))
    if missing:
        raise ValueError(f"manifest is missing required keys: {', '.join(missing)}")
    
    result_manifest = dict(manifest)
    result_manifest["model_id"] = build_model_id(manifest)
    destination = model_path(result_manifest["model_id"], root)
    destination.mkdir(parents=True, exist_ok=True)
    
    if trained.family == "xgboost":
        filename = "model.json"
        trained.model.save_model(destination / filename)
    elif trained.family == "lightgbm":
        filename = "model.txt"
        trained.model.booster_.save_model(destination / filename)
    else:
        raise ValueError(f"Unknown model family: {trained.family}")
    
    result_manifest["model_file"] = filename
    (destination / "manifest.json").write_text(json.dumps(result_manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    trained.validation_predictions.assign(model_id=result_manifest["model_id"]).to_parquet(destination / "validation_predictions.parquet", index=False)
    trained.test_predictions.assign(model_id=result_manifest["model_id"]).to_parquet(destination / "test_predictions.parquet", index=False)
    return destination

def load_model_manifest(model_id: str, root: Path = MODELS_DIR) -> dict[str, object]:
    path = model_path(model_id, root) / "manifest.json"
    if not path.exists():
        raise FileNotFoundError(f"Stored model not found: {model_id}")
    return json.loads(path.read_text(encoding="utf-8"))

def load_predictions(model_id: str, split: str, root: Path = MODELS_DIR) -> pd.DataFrame:
    if split not in {"validation", "test"}:
        raise ValueError("split must be validation or test")
    
    path = model_path(model_id, root) / f"{split}_predictions.parquet"
    if not path.exists():
        raise FileNotFoundError(f"Stored predictions not found: {model_id}/{split})")
    
    return pd.read_parquet(path)