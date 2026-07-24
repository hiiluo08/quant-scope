import numpy as np
import pandas as pd
import pytest

from ml.factors.technical import RSIFactor, SMARatioFactor


def test_sma_ratio_matches_grouped_rolling_means(ohlcv_frame):
    factor = SMARatioFactor(short_window=20, long_window=50)
    values = factor.compute(ohlcv_frame)
    prepared = ohlcv_frame.sort_values(["symbol", "date"]).reset_index(drop=True)
    expected = prepared.groupby("symbol", sort=False)["adjusted_close"].transform(
        lambda price: price.rolling(20, min_periods=20).mean()
        / price.rolling(50, min_periods=50).mean()
        - 1
    )
    pd.testing.assert_series_equal(values, expected, check_names=False)


def test_rsi_returns_100_for_persistent_uptrend(ohlcv_frame):
    values = RSIFactor(period=14).compute(ohlcv_frame)
    assert values.dropna().iloc[-1] == pytest.approx(100.0)


def test_rsi_returns_nan_for_flat_prices(ohlcv_frame):
    ohlcv_frame["adjusted_close"] = 100.0
    values = RSIFactor(period=14).compute(ohlcv_frame)
    assert values.isna().all()


def test_sma_ratio_rejects_invalid_windows():
    with pytest.raises(ValueError, match="Short window"):
        SMARatioFactor(short_window=50, long_window=20)