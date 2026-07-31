"""MACD (Moving Average Convergence Divergence) factor family."""
from __future__ import annotations

import pandas as pd
from ml.factors.base import Factor, prepare_factor_input


class MACDFactor(Factor):
    """MACD Line = EMA(fast) - EMA(slow)."""

    def __init__(self, fast: int = 12, slow: int = 26) -> None:
        if fast >= slow:
            raise ValueError("fast period must be less than slow period")
        self.fast = fast
        self.slow = slow
        self.name = f"macd_{fast}_{slow}"
        self.warmup_periods = slow

    def metadata(self) -> dict[str, object]:
        return {
            **super().metadata(),
            "parameters": {"fast": self.fast, "slow": self.slow},
        }

    def compute(self, df: pd.DataFrame) -> pd.Series:
        import polars as pl
        prepared = prepare_factor_input(df)
        pldf = pl.from_pandas(prepared[["symbol", "adjusted_close"]])

        res = pldf.with_columns(
            ema_fast=pl.col("adjusted_close").ewm_mean(span=self.fast, min_periods=self.fast, adjust=False).over("symbol"),
            ema_slow=pl.col("adjusted_close").ewm_mean(span=self.slow, min_periods=self.slow, adjust=False).over("symbol")
        ).with_columns(
            macd_line=pl.col("ema_fast") - pl.col("ema_slow")
        )

        res_series = res.get_column("macd_line").to_pandas()
        res_series.name = self.name
        return res_series


class MACDSignalFactor(Factor):
    """MACD Signal Line = EMA(signal_period) of MACD Line."""

    def __init__(self, fast: int = 12, slow: int = 26, signal: int = 9) -> None:
        if fast >= slow:
            raise ValueError("fast period must be less than slow period")
        self.fast = fast
        self.slow = slow
        self.signal = signal
        self.name = f"macd_signal_{fast}_{slow}_{signal}"
        self.warmup_periods = slow + signal

    def metadata(self) -> dict[str, object]:
        return {
            **super().metadata(),
            "parameters": {"fast": self.fast, "slow": self.slow, "signal": self.signal},
        }

    def compute(self, df: pd.DataFrame) -> pd.Series:
        import polars as pl
        prepared = prepare_factor_input(df)
        pldf = pl.from_pandas(prepared[["symbol", "adjusted_close"]])

        res = pldf.with_columns(
            ema_fast=pl.col("adjusted_close").ewm_mean(span=self.fast, min_periods=self.fast, adjust=False).over("symbol"),
            ema_slow=pl.col("adjusted_close").ewm_mean(span=self.slow, min_periods=self.slow, adjust=False).over("symbol")
        ).with_columns(
            macd_line=pl.col("ema_fast") - pl.col("ema_slow")
        ).with_columns(
            macd_signal=pl.col("macd_line").ewm_mean(span=self.signal, min_periods=self.signal, adjust=False).over("symbol")
        )

        res_series = res.get_column("macd_signal").to_pandas()
        res_series.name = self.name
        return res_series

