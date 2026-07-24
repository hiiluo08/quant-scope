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
        prepared = prepare_factor_input(df)
        
        def zscore(volume: pd.Series) -> pd.Series:
            mean = volume.rolling(self.window, min_periods=self.window).mean()
            std = volume.rolling(self.window, min_periods=self.window).std(ddof=1)
            return ((volume - mean) / std).replace([np.inf, -np.inf], np.nan)
        
        return prepared.groupby("symbol", sort=False)["volume"].transform(zscore)