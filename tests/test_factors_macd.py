"""Tests for MACD factor family."""
import pandas as pd
import pytest
from ml.factors.macd import MACDFactor, MACDSignalFactor


def test_macd_factor_validation():
    with pytest.raises(ValueError, match="fast period must be less than slow period"):
        MACDFactor(fast=26, slow=12)


def test_macd_signal_factor_validation():
    with pytest.raises(ValueError, match="fast period must be less than slow period"):
        MACDSignalFactor(fast=30, slow=20)


def test_macd_factor_computation(ohlcv_frame):
    factor = MACDFactor(fast=12, slow=26)
    series = factor.compute(ohlcv_frame)
    assert len(series) == len(ohlcv_frame)
    assert series.name == "macd_12_26"


def test_macd_signal_factor_computation(ohlcv_frame):
    factor = MACDSignalFactor(fast=12, slow=26, signal=9)
    series = factor.compute(ohlcv_frame)
    assert len(series) == len(ohlcv_frame)
    assert series.name == "macd_signal_12_26_9"
