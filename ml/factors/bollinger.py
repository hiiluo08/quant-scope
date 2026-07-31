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
        import polars as pl
        prepared = prepare_factor_input(df)
        pldf = pl.from_pandas(prepared[["symbol", "adjusted_close"]])

        res = pldf.with_columns(
            sma=pl.col("adjusted_close").rolling_mean(self.window).over("symbol"),
            std=pl.col("adjusted_close").rolling_std(self.window, ddof=1).over("symbol")
        ).with_columns(
            bb_width=(2 * self.num_std * pl.col("std")) / pl.col("sma")
        )
        
        res_series = res.get_column("bb_width").to_pandas()
        res_series.name = self.name
        return res_series

