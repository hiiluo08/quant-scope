from __future__ import annotations

import numpy as np
import pandas as pd

from ml.factors.base import Factor, prepare_factor_input

class RSIFactor(Factor):
    def __init__(self, period: int = 14) -> None:
        if period < 1:
            raise ValueError("Period must be at least 1")
        self.period = period
        self.name = f"rsi_{period}"
        self.warmup_periods = period
        
    def metadata(self) -> dict[str, object]:
        return {
            **super().metadata(),
            "parameters": {
                "period": self.period,
                "method": "wilder_ewm"
            }
        }
    
    def compute(self, df: pd.DataFrame) -> pd.Series:
        import polars as pl
        prepared = prepare_factor_input(df)
        pldf = pl.from_pandas(prepared[["symbol", "adjusted_close"]])
        
        # RSI in Polars
        res = pldf.with_columns(
            delta=pl.col("adjusted_close").diff().over("symbol")
        ).with_columns(
            gain=pl.when(pl.col("delta") > 0).then(pl.col("delta")).otherwise(0),
            loss=pl.when(pl.col("delta") < 0).then(-pl.col("delta")).otherwise(0)
        ).with_columns(
            avg_gain=pl.col("gain").ewm_mean(alpha=1/self.period, min_periods=self.period, adjust=False).over("symbol"),
            avg_loss=pl.col("loss").ewm_mean(alpha=1/self.period, min_periods=self.period, adjust=False).over("symbol")
        ).with_columns(
            rs=pl.col("avg_gain") / pl.col("avg_loss")
        ).with_columns(
            rsi=pl.when(pl.col("avg_loss") == 0).then(
                pl.when(pl.col("avg_gain") > 0).then(100.0).otherwise(None)
            ).otherwise(100 - (100 / (1 + pl.col("rs"))))
        )
            
        res_series = res.get_column("rsi").to_pandas()
        return res_series
    
class SMARatioFactor(Factor):
    def __init__(self, short_window: int = 20, long_window: int = 50) -> None:
        if short_window < 1 or long_window < 1 or short_window >= long_window:
            raise ValueError("Short window must be positive and smaller than long_window")
        self.short_window = short_window
        self.long_window = long_window
        self.name = f"sma_ratio_{short_window}_{long_window}"
        self.warmup_periods = long_window
        
    def metadata(self) -> dict[str, object]:
        return {
            **super().metadata(),
            "parameters": {
                "short_window": self.short_window,
                "long_window": self.long_window
            }
        }
    
    def compute(self, df: pd.DataFrame) -> pd.Series:
        import polars as pl
        prepared = prepare_factor_input(df)
        pldf = pl.from_pandas(prepared[["symbol", "adjusted_close"]])
        
        res = pldf.with_columns(
            short_sma=pl.col("adjusted_close").rolling_mean(self.short_window).over("symbol"),
            long_sma=pl.col("adjusted_close").rolling_mean(self.long_window).over("symbol")
        ).with_columns(
            ratio=(pl.col("short_sma") / pl.col("long_sma")) - 1
        )
        
        return res.get_column("ratio").to_pandas()