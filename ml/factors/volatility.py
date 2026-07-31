from __future__ import annotations

import pandas as pd

from ml.factors.base import Factor, prepare_factor_input

class VolatilityFactor(Factor):
    def __init__(self, window: int) -> None:
        if window < 2:
            raise ValueError("Window must be at least 2")
        self.window = window
        self.name = f"volatility_{window}d"
        self.warmup_periods = window
        
    def metadata(self) -> dict[str, object]:
        return {
            **super().metadata(),
            "parameters": {
                "window": self.window,
                "annualized": False,
                "ddof": 1
            }
        }
    
    def compute(self, df: pd.DataFrame) -> pd.Series:
        import polars as pl
        prepared = prepare_factor_input(df)
        pldf = pl.from_pandas(prepared[["symbol", "return_1d"]])
        
        res = pldf.with_columns(
            volatility=pl.col("return_1d").rolling_std(self.window, ddof=1).over("symbol")
        )
        return res.get_column("volatility").to_pandas()