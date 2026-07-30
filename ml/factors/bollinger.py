"""Bollinger Bands Width factor."""
from __future__ import annotations

import pandas as pd
from ml.factors.base import Factor, prepare_factor_input


class BollingerWidthFactor(Factor):
    """BB Width = (Upper - Lower) / SMA — normalized volatility measure."""

    def __init__(self, window: int = 20, num_std: float = 2.0) -> None:
        if window < 2:
            raise ValueError("Window must be at least 2")
        self.window = window
        self.num_std = num_std
        self.name = f"bollinger_width_{window}"
        self.warmup_periods = window

    def metadata(self) -> dict[str, object]:
        return {
            **super().metadata(),
            "parameters": {"window": self.window, "num_std": self.num_std},
        }

    def compute(self, df: pd.DataFrame) -> pd.Series:
        prepared = prepare_factor_input(df)

        def _bb_width(prices: pd.Series) -> pd.Series:
            sma = prices.rolling(self.window, min_periods=self.window).mean()
            std = prices.rolling(self.window, min_periods=self.window).std(ddof=1)
            upper = sma + self.num_std * std
            lower = sma - self.num_std * std
            return (upper - lower) / sma

        res = prepared.groupby("symbol", sort=False)["adjusted_close"].transform(_bb_width)
        res.name = self.name
        return res

