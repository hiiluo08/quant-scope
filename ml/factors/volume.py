from __future__ import annotations

import numpy as np
import pandas as pd

from ml.factors.base import Factor, prepare_factor_input

class VolumeZScoreFactor(Factor):
    def __init__(self, window: int = 20) -> None:
        if window < 2:
            raise ValueError("Window must be at least 2")
        self.window = window
        self.name = f"volume_zscore_{window}d"
        self.warmup_periods = window
        
    def metadata(self) -> dict[str, object]:
        return {
            **super().metadata(),
            "parameters": {
                "window": self.window,
                "ddof": 1
            }
        }
        
    def compute(self, df: pd.DataFrame) -> pd.Series:
        import polars as pl
        prepared = prepare_factor_input(df)
        pldf = pl.from_pandas(prepared[["symbol", "volume"]])
        
        res = pldf.with_columns(
            volume_mean=pl.col("volume").rolling_mean(self.window).over("symbol"),
            volume_std=pl.col("volume").rolling_std(self.window, ddof=1).over("symbol")
        ).with_columns(
            volume_zscore=(pl.col("volume") - pl.col("volume_mean")) / pl.col("volume_std")
        )
        
        # Replace inf with nan in pandas since polars doesn't have a direct inf replace
        res_series = res.get_column("volume_zscore").to_pandas()
        return res_series.replace([np.inf, -np.inf], np.nan)