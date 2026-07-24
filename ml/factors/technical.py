from __future__ import annotations

import numpy as np
import pandas as pd

from ml.factors.base import Factor, prepare_factor_input

class RSIFactor(Factor):
    def __init__(self, period: int = 14) -> None:
        if period < 1:
            raise ValueError("Period must be at least 1")
        self.period = period
        self.name = f"rsi_{period}d"
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
        prepared = prepare_factor_input(df)
        
        def rsi(prices: pd.Series) -> pd.Series:
            delta = prices.diff()
            gains = delta.clip(lower=0)
            losses = (-delta.clip(upper=0))
            average_gain = gains.ewm(alpha=1 / self.period, adjust=False, min_periods=self.period).mean()
            average_loss = losses.ewm(alpha=1 / self.period, adjust=False, min_periods=self.period).mean()
            rs = average_gain / average_loss
            rsi_values = 100 - (100 / (1 + rs))
            return rsi_values.mask((average_loss == 0) & (average_gain > 0), 100.0).mask(
                (average_gain == 0) & (average_loss > 0), 0.0
            ).mask((average_gain == 0) & (average_loss == 0), np.nan)
            
        return prepared.groupby("symbol", sort=False)["adjusted_close"].transform(rsi)
    
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
        prepared = prepare_factor_input(df)
        
        def ratio(prices: pd.Series) -> pd.Series:
            short_sma = prices.rolling(self.short_window, min_periods=self.short_window).mean()
            long_sma = prices.rolling(self.long_window, min_periods=self.long_window).mean()
            return short_sma / long_sma - 1
        
        return prepared.groupby("symbol", sort=False)["adjusted_close"].transform(ratio)