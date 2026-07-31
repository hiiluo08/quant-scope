from __future__ import annotations

import pandas as pd

from ml.factors.base import Factor, prepare_factor_input

class MomentumFactor(Factor):
    def __init__(self, window: int) -> None:
        if window < 1:
            raise ValueError("Window must be at least 1")
        self.window = window
        self.name = f"momentum_{window}d"
        self.warmup_periods = window
        
    def metadata(self) -> dict:
        return {
            **super().metadata(),
            "parameters": {
                "window": self.window
            }
        }
    
    def compute(self, df: pd.DataFrame) -> pd.Series:
        import polars as pl
        prepared = prepare_factor_input(df)
        pldf = pl.from_pandas(prepared[["symbol", "adjusted_close"]])
        
        # (price / price.shift(window)) - 1
        res = pldf.with_columns(
            momentum=(pl.col("adjusted_close") / pl.col("adjusted_close").shift(self.window).over("symbol")) - 1
        )
        return res.get_column("momentum").to_pandas()

class LaggedReturnFactor(Factor):
    """Lagged close price return: close_t / close_{t-lag} - 1."""

    def __init__(self, lag: int = 1) -> None:
        if lag < 1:
            raise ValueError("Lag must be at least 1")
        self.lag = lag
        self.name = f"lag_return_{lag}d"
        self.warmup_periods = lag

    def metadata(self) -> dict:
        return {**super().metadata(), "parameters": {"lag": self.lag}}

    def compute(self, df: pd.DataFrame) -> pd.Series:
        import polars as pl
        prepared = prepare_factor_input(df)
        pldf = pl.from_pandas(prepared[["symbol", "adjusted_close"]])
        
        res = pldf.with_columns(
            lag_return=(pl.col("adjusted_close") / pl.col("adjusted_close").shift(self.lag).over("symbol")) - 1
        )
        return res.get_column("lag_return").to_pandas()