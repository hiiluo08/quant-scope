import pandas as pd

from ml.strategies.momentum import MomentumLongOnlyStrategy


def test_momentum_strategy_goes_long_only_for_positive_factor_values():
    factors = pd.DataFrame(
        {
            "date": pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-02"]),
            "symbol": ["AAA", "AAA", "SPY"],
            "factor_name": ["momentum_20d"] * 3,
            "factor_value": [-0.01, 0.02, 0.0],
            "factor_version": ["v1"] * 3,
            "computed_at": ["2026-07-25T00:00:00Z"] * 3,
        }
    )

    signals = MomentumLongOnlyStrategy().generate_signals(factors)

    assert signals["signal"].tolist() == [0.0, 1.0, 0.0]
    assert list(signals.columns) == ["date", "symbol", "signal"]


def test_momentum_strategy_drops_warmup_nan_not_fill_it_as_signal():
    factors = pd.DataFrame(
        {
            "date": pd.to_datetime(["2024-01-02", "2024-01-03"]),
            "symbol": ["AAA", "AAA"],
            "factor_name": ["momentum_20d", "momentum_20d"],
            "factor_value": [float("nan"), 0.02],
            "factor_version": ["v1", "v1"],
            "computed_at": ["2026-07-25T00:00:00Z"] * 2,
        }
    )

    signals = MomentumLongOnlyStrategy().generate_signals(factors)
    assert len(signals) == 1
    assert signals.iloc[0]["signal"] == 1.0