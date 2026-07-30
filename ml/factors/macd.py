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
        prepared = prepare_factor_input(df)

        def _macd(prices: pd.Series) -> pd.Series:
            ema_fast = prices.ewm(span=self.fast, adjust=False, min_periods=self.fast).mean()
            ema_slow = prices.ewm(span=self.slow, adjust=False, min_periods=self.slow).mean()
            return ema_fast - ema_slow

        return prepared.groupby("symbol", sort=False)["adjusted_close"].transform(_macd)


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
        prepared = prepare_factor_input(df)

        def _signal(prices: pd.Series) -> pd.Series:
            ema_fast = prices.ewm(span=self.fast, adjust=False, min_periods=self.fast).mean()
            ema_slow = prices.ewm(span=self.slow, adjust=False, min_periods=self.slow).mean()
            macd_line = ema_fast - ema_slow
            return macd_line.ewm(span=self.signal, adjust=False, min_periods=self.signal).mean()

        return prepared.groupby("symbol", sort=False)["adjusted_close"].transform(_signal)
