import pytest

from ml.factors.momentum import MomentumFactor
from ml.factors.registry import FactorRegistry, build_default_registry


def test_registry_rejects_duplicate_name():
    registry = FactorRegistry()
    registry.register(MomentumFactor(20))

    with pytest.raises(ValueError, match="already registered"):
        registry.register(MomentumFactor(20))


def test_registry_rejects_unknown_factor(ohlcv_frame):
    with pytest.raises(KeyError, match="Unknown factor"):
        FactorRegistry().compute("not_a_factor", ohlcv_frame)


def test_default_registry_exposes_baseline_factors():
    names = {item["name"] for item in build_default_registry().list_metadata()}
    assert names == {
        "momentum_20d",
        "momentum_60d",
        "volatility_20d",
        "rsi_14",
        "sma_ratio_20_50",
        "volume_zscore_20d",
        "macd_12_26",
        "macd_signal_12_26_9",
        "bollinger_width_20",
        "lag_return_1d",
        "lag_return_2d",
        "lag_return_3d",
    }


def test_registry_compute_returns_tidy_frame(ohlcv_frame):
    result = build_default_registry().compute("momentum_20d", ohlcv_frame)
    assert list(result.columns) == [
        "date", "symbol", "factor_name", "factor_value", "factor_version", "computed_at"
    ]
    assert set(result["factor_name"]) == {"momentum_20d"}