from __future__ import annotations

from datetime import date
from pathlib import Path

import pandas as pd
from fastapi import APIRouter, HTTPException, Query

from backend.app.core.config import settings
from ml.factors.registry import build_default_registry
from ml.factors.storage import load_factor_values

router = APIRouter(prefix="/factors", tags=["factors"])


def load_factor_data(factor_name: str) -> pd.DataFrame:
    registry = build_default_registry()
    try:
        registry.get(factor_name)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=f"Factor {factor_name} is not registered") from exc

    try:
        return load_factor_values(factor_name, root=Path(settings.factors_dir))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=f"Stored output not found for {factor_name}") from exc
    except (OSError, ValueError) as exc:
        raise HTTPException(status_code=503, detail="Factor dataset is unavailable") from exc


def _records(frame: pd.DataFrame) -> list[dict[str, object]]:
    serializable = frame.copy()
    serializable["date"] = pd.to_datetime(serializable["date"]).dt.strftime("%Y-%m-%d")
    return serializable.to_dict(orient="records")


@router.get("")
def list_factors() -> dict[str, object]:
    factors = build_default_registry().list_metadata()
    return {"factors": factors, "count": len(factors)}


@router.get("/{factor_name}/latest")
def get_latest_factor_values(factor_name: str) -> dict[str, object]:
    frame = load_factor_data(factor_name).dropna(subset=["factor_value"])
    if frame.empty:
        raise HTTPException(status_code=404, detail=f"No non-null values available for {factor_name}")
    latest_index = frame.groupby("symbol")["date"].idxmax()
    latest = frame.loc[latest_index].sort_values("symbol")
    return {
        "factor_name": factor_name,
        "factor_version": latest["factor_version"].iloc[0],
        "count": len(latest),
        "data": _records(latest),
    }


@router.get("/{factor_name}")
def get_factor_values(
    factor_name: str,
    symbol: str | None = Query(None, min_length=1, max_length=10),
    start_date: str | None = None,
    end_date: str | None = None,
    limit: int = Query(100, ge=1, le=5000),
) -> dict[str, object]:
    if start_date and end_date and start_date > end_date:
        raise HTTPException(status_code=422, detail="start_date must not be after end_date")

    frame = load_factor_data(factor_name)

    if symbol:
        frame = frame[frame["symbol"] == symbol.upper()]
    if start_date:
        frame = frame[frame["date"] >= pd.Timestamp(start_date)]
    if end_date:
        frame = frame[frame["date"] <= pd.Timestamp(end_date)]

    frame = frame.sort_values(["date", "symbol"]).tail(limit)

    if frame.empty:
        raise HTTPException(status_code=404, detail="No factor values match the requested filters")
    return {
        "factor_name": factor_name,
        "factor_version": frame["factor_version"].iloc[0],
        "count": len(frame),
        "data": _records(frame),
    }