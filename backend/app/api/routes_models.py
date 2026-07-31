from __future__ import annotations

from pathlib import Path

import pandas as pd
from fastapi import APIRouter, HTTPException, Query

from backend.app.core.config import settings
from ml.training.storage import load_model_manifest, load_predictions

router = APIRouter(prefix="/models", tags=["models"])

def _records(frame: pd.DataFrame) -> list[dict[str, object]]:
    result = frame.copy()
    result["date"] = pd.to_datetime(result["date"]).dt.strftime("%Y-%m-%d")
    return result.to_dict(orient="records")

@router.get("")
def list_models() -> dict[str, object]:
    root = Path(settings.models_dir)
    manifests = []
    if root.exists():
        for path in sorted(root.glob("model_id=*/manifest.json")):
            manifests.append(__import__("json").loads(path.read_text(encoding="utf-8")))
    manifests.sort(key=lambda x: x.get("split_dates", {}).get("test_end", ""), reverse=True)
    return {"models": manifests, "count": len(manifests)}

@router.get("/{model_id}")
def get_model(model_id: str) -> dict[str, object]:
    try: 
        return load_model_manifest(model_id, root=Path(settings.models_dir))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=f"Model {model_id} not found") from exc
    
@router.get("/{model_id}/predictions")
def get_predictions(model_id: str, split: str = Query("test", pattern="^(validation|test)$"), limit: int = Query(100, ge=1, le=5000)) -> dict[str, object]:
    try:
        frame = load_predictions(model_id, split, root=Path(settings.models_dir)).sort_values(["date", "symbol"]).tail(limit)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=f"Predictions for model {model_id} and split {split} not found") from exc
    return {"model_id": model_id, "split": split, "count": len(frame), "data": _records(frame)}