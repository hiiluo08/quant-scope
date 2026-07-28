from __future__ import annotations

import math

import pandas as pd
from sklearn.metrics import mean_absolute_error, root_mean_squared_error

TARGET_COLUMN = "forward_return_5d"

def _finite_or_none(value: float) -> float | None:
    return float(value) if math.isfinite(float(value)) else None

def evaluate_predictions(predictions: pd.DataFrame) -> dict[str, float | None]:
    required = {TARGET_COLUMN, "prediction"}
    missing = sorted(required - set(predictions.columns))
    if missing:
        raise ValueError(f"predictions is missing required columns: {', '.join(missing)}")
    
    frame = predictions.dropna(subset=[TARGET_COLUMN, "prediction"])
    if frame.empty:
        raise ValueError("predictions has no finite target/prediction rows")
    
    rmse = root_mean_squared_error(frame[TARGET_COLUMN], frame["prediction"])
    mae = mean_absolute_error(frame[TARGET_COLUMN], frame["prediction"])
    rank_ic = frame[TARGET_COLUMN].corr(frame["prediction"], method="spearman")
    directional_accuracy = ((frame[TARGET_COLUMN] > 0) == (frame["prediction"] > 0)).mean()
    
    return {
        "rmse": _finite_or_none(rmse),
        "mae": _finite_or_none(mae),
        "rank_ic": _finite_or_none(rank_ic),
        "directional_accuracy": _finite_or_none(directional_accuracy),
    }
    
def select_champion(validation_metrics: dict[str, dict[str, float | None]]) -> str:
    eligible = [name for name, metric in validation_metrics.items() if metric["rmse"] is not None]
    if not eligible:
        raise ValueError("no model has a finite validation RMSE")
    
    return min(eligible, key=lambda name: (float(validation_metrics[name]["rmse"]), 
                                           -float(validation_metrics[name]["rank_ic"] or float("-inf")),
                                           name))