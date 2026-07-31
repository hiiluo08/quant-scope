from __future__ import annotations

from pathlib import Path

import pandas as pd
from fastapi import APIRouter, HTTPException, Query

from backend.app.core.config import settings
from ml.backtesting.storage import load_backtest_result, list_backtests

router = APIRouter(prefix="/backtests", tags=["backtests"])

def _load(backtest_id: str) -> tuple[dict[str, object], pd.DataFrame]:
    try:
        return load_backtest_result(backtest_id, root=Path(settings.backtests_dir))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=f"Backtest not found: {backtest_id}") from exc
    except ValueError as exc:
        raise HTTPException(status_code=500, detail="Backtest artifact is unavailable") from exc
    
def _records(frame: pd.DataFrame) -> list[dict[str, object]]:
    result = frame.copy()
    result["date"] = pd.to_datetime(result["date"]).dt.strftime("%Y-%m-%d")
    return result.to_dict(orient="records")

@router.get("")
def get_backtests() -> dict[str, object]:
    backtests = list_backtests(root=Path(settings.backtests_dir))
    backtests.sort(key=lambda x: x.get("end_date", ""), reverse=True)
    return {"backtests": backtests, "count": len(backtests)}

@router.get("/{backtest_id}")
def get_backtest(backtest_id: str) -> dict[str, object]:
    metadata, _ = _load(backtest_id)
    return metadata

@router.get("/{backtest_id}/daily")
def get_backtest_daily(backtest_id: str, limit: int = Query(100, ge=1, le=5000)) -> dict[str, object]:
    _, daily_results = _load(backtest_id)
    daily_results = daily_results.sort_values("date").tail(limit)
    return {"backtest_id": backtest_id, "data": _records(daily_results), "count": len(daily_results)}