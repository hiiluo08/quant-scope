from __future__ import annotations

import pandas as pd

def build_forward_return_labels(market_data: pd.DataFrame, horizon_days: int = 5) -> pd.DataFrame:
    if horizon_days < 1:
        raise ValueError("horizon_days must be at least 1")
    
    required = {"date", "symbol", "adjusted_close"}
    missing = sorted(required - set(market_data.columns))
    if missing:
        raise ValueError(f"market_data is missing required columns: {', '.join(missing)}")
    
    frame = market_data[["date", "symbol", "adjusted_close"]].copy()
    frame["date"] = pd.to_datetime(frame["date"])
    if frame.duplicated(["date", "symbol"]).any():
        raise ValueError("market_data contains duplicate date and symbol rows")
    if (frame["adjusted_close"] <= 0).any():
        raise ValueError("adjusted_close must be positive")
    
    frame = frame.sort_values(["symbol", "date"]).reset_index(drop=True)
    target_name = f"forward_return_{horizon_days}d"
    future_price = frame.groupby("symbol", sort=False)["adjusted_close"].shift(-horizon_days)
    frame[target_name] = future_price / frame["adjusted_close"] - 1.0
    return frame[["date", "symbol", target_name]]