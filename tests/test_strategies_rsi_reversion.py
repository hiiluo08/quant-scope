import pandas as pd

from ml.strategies.rsi_reversion import RSIMeanReversionStrategy


def _rsi_frame(values: list[float]) -> pd.DataFrame:
    return pd.DataFrame(
        {
            "date": pd.date_range("2024-01-02", periods=len(values), freq="B"),
            "symbol": ["AAA"] * len(values),
            "factor_name": ["rsi_14"] * len(values),
            "factor_value": values,
            "factor_version": ["v1"] * len(values),
            "computed_at": ["2026-07-25T00:00:00Z"] * len(values),
        }
    )


def test_rsi_strategy_enters_holds_and_exits_at_explicit_thresholds():
    signals = RSIMeanReversionStrategy().generate_signals(_rsi_frame([50.0, 29.0, 40.0, 55.0, 45.0]))
    assert signals["signal"].tolist() == [0.0, 1.0, 1.0, 0.0, 0.0]


def test_rsi_strategy_keeps_symbol_state_isolated():
    factors = pd.concat(
        [_rsi_frame([29.0, 40.0]), _rsi_frame([50.0, 55.0]).assign(symbol="SPY")],
        ignore_index=True,
    )
    signals = RSIMeanReversionStrategy().generate_signals(factors)
    assert signals.loc[signals["symbol"] == "AAA", "signal"].tolist() == [1.0, 1.0]
    assert signals.loc[signals["symbol"] == "SPY", "signal"].tolist() == [0.0, 0.0]


def test_rsi_strategy_drops_warmup_rows():
    signals = RSIMeanReversionStrategy().generate_signals(_rsi_frame([float("nan"), 29.0]))
    assert signals["date"].tolist() == [pd.Timestamp("2024-01-03")]
    assert signals["signal"].tolist() == [1.0]