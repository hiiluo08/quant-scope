"""Tests for Bollinger Bands Width factor."""
import pandas as pd
import pytest
from ml.factors.bollinger import BollingerWidthFactor


def test_bollinger_width_validation():
    with pytest.raises(ValueError, match="Window must be at least 2"):
        BollingerWidthFactor(window=1)


def test_bollinger_width_computation(ohlcv_frame):
    factor = BollingerWidthFactor(window=20)
    series = factor.compute(ohlcv_frame)
    assert len(series) == len(ohlcv_frame)
    assert series.name == "bollinger_width_20"
