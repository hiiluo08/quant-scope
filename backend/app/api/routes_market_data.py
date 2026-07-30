from fastapi import APIRouter, HTTPException, Query
from pathlib import Path
import pandas as pd
from typing import Optional

from backend.app.core.config import settings

router = APIRouter(prefix="/market-data", tags=["market_data"])
PROCESSED_PATH = Path(settings.processed_file)

def load_data() -> pd.DataFrame:
    if not PROCESSED_PATH.exists():
        raise HTTPException(status_code=503, detail="Processed data not found. Run data pipeline first.")
    return pd.read_parquet(PROCESSED_PATH)

import json

@router.get("/symbols")
def get_symbols():
    config_path = Path("data/config/tickers.json")
    with open(config_path) as f:
        config = json.load(f)
    
    all_symbols = []
    for sector_data in config["sectors"].values():
        all_symbols.extend(sector_data["symbols"])
    
    symbols = sorted(list(set(all_symbols)))
    return {"symbols": symbols, "count": len(symbols)}

@router.get("/{symbol}")
def get_market_data(
    symbol: str,
    start_date: Optional[str] = Query(None, description="Start date YYYY-MM-DD"),
    end_date: Optional[str] = Query(None, description="End date YYYY-MM-DD"),
    limit: int = Query(100, ge=1, le=5000)
):
    df = load_data()
    symbol = symbol.upper()
    df = df[df["symbol"] == symbol]
    
    if df.empty:
        raise HTTPException(status_code=404, detail=f"Symbol {symbol} not found")
    
    if start_date:
        df = df[df["date"] >= pd.to_datetime(start_date)]
    
    if end_date:
        df = df[df["date"] <= pd.to_datetime(end_date)]
    
    df = df.sort_values("date").tail(limit)
    
    return {
        "symbol": symbol,
        "count": len(df),
        "data": df[["date", "open", "high", "low", "close", "adjusted_close", "volume"]].to_dict(orient="records")
    }
    
@router.get("/{symbol}/returns")
def get_returns(
    symbol: str,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
):
    df = load_data()
    symbol = symbol.upper()
    df = df[df["symbol"] == symbol]
    if df.empty:
        raise HTTPException(status_code=404, detail=f"Symbol {symbol} not found")
    if start_date:
        df = df[df["date"] >= pd.to_datetime(start_date)]
    if end_date:
        df = df[df["date"] <= pd.to_datetime(end_date)]
    df = df.dropna(subset=["return_1d"])
    return {
        "symbol": symbol,
        "count": len(df),
        "data": df[["date", "return_1d", "log_return_1d"]].to_dict(orient="records")
    }