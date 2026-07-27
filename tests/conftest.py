from __future__ import annotations

import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

import numpy as np
import pandas as pd
import pytest

@pytest.fixture
def ohlcv_frame() -> pd.DataFrame:
    dates = pd.date_range("2024-01-02", periods=80, freq="B")
    frames = []
    for symbol, start_price, volume_base in (("AAA", 100.0, 1_000), ("BBB", 200.0, 5_000)):
        close = start_price + np.arange(len(dates), dtype=float)
        frame = pd.DataFrame(
            {
                "date": dates,
                "symbol": symbol,
                "open": close - 0.5,
                "high": close + 1.0,
                "low": close - 1.0,
                "close": close,
                "adjusted_close": close,
                "volume": volume_base + np.arange(len(dates)) * 10,
                "source": "fixture",
                "processed_at": "2026-07-24T00:00:00Z",
            }
        )
        frame["return_1d"] = frame["adjusted_close"].pct_change()
        frame["log_return_1d"] = np.log(
            frame["adjusted_close"] / frame["adjusted_close"].shift(1)
        )
        frame["is_valid"] = frame["return_1d"].notna()
        frames.append(frame)
    return pd.concat(frames, ignore_index=True).sort_values(
        ["date", "symbol"]
    ).reset_index(drop=True)
    
@pytest.fixture
def backtest_market_frame() -> pd.DataFrame:
    dates = pd.date_range("2024-01-02", periods=5, freq="B")
    return pd.DataFrame(
        {
            "date": list(dates) * 2,
            "symbol": ["AAA"] * 5 + ["SPY"] * 5,
            "adjusted_close": [100, 101, 111.1, 111.1, 122.21, 100, 100, 100, 110, 110],
            "return_1d": [0.0, 0.01, 0.10, 0.0, 0.10, 0.0, 0.0, 0.0, 0.10, 0.0],
            "is_valid": [True] * 10,
        }
    )