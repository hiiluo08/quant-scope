from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

MARKET_COLUMNS = ("date", "symbol", "adjusted_close", "return_1d", "is_valid")
SIGNAL_COLUMNS = ("date", "symbol", "signal")

@dataclass(frozen=True)
class BacktestConfig:
    strategy_name: str
    start_date: str
    end_date: str
    transaction_cost_bps: float = 5.0
    slippage_bps: float = 5.0
    initial_equity: float = 1.0
    trading_days_per_year: int = 252
    engine_version: str = "v1"
    
    def __post_init__(self) -> None:
        if not self.strategy_name:
            raise ValueError("stategy_name must not be empty")
        
        if self.transaction_cost_bps < 0 or self.slippage_bps < 0:
            raise ValueError("cost values must be non-negative")
        
        if self.initial_equity <= 0 or self.trading_days_per_year < 1:
            raise ValueError("initial_equity and trading_days_per_year must be positive")
        
def _require_columns(frame: pd.DataFrame, columns: tuple[str, ...], label: str) -> None:
    missing = sorted(set(columns) - set(frame.columns))
    
    if missing:
        raise ValueError(f"{label} is missing required columns: {', '.join(missing)}")
    
def prepare_market_data(frame: pd.DataFrame) -> pd.DataFrame:
    _require_columns(frame, MARKET_COLUMNS, "market_data")
    result = frame.loc[:, MARKET_COLUMNS].copy()
    result["date"] = pd.to_datetime(result["date"])
    
    if result.duplicated(["date", "symbol"]).any():
        raise ValueError("market_data contains duplicate date and symbol rows")
    if not np.isfinite(result["return_1d"]).all():
        raise ValueError("market_data return_1d values must be finite")
    if (result["adjusted_close"] <= 0).any():
        raise ValueError("market_data adjusted_close values must be positive")
    return result.sort_values(["symbol", "date"]).reset_index(drop=True)

def prepare_signal_frame(frame: pd.DataFrame) -> pd.DataFrame:
    _require_columns(frame, SIGNAL_COLUMNS, "signals")
    result = frame.loc[:, SIGNAL_COLUMNS].copy()
    result["date"] = pd.to_datetime(result["date"])
    
    if result.duplicated(["date", "symbol"]).any():
        raise ValueError("signals contains duplicate date and symbol rows")
    if not np.isfinite(result["signal"]).all():
        raise ValueError("signals signal values must be finite")
    if not result["signal"].between(0.0, 1.0).all():
        raise ValueError("signals signal values must be between 0 and 1")
    return result.sort_values(["symbol", "date"]).reset_index(drop=True)