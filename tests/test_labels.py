import pandas as pd
import pytest

from ml.features.labels import build_forward_return_labels

def test_forward_return_uses_price_five_rows_later_per_symbol():
    dates = pd.date_range("2024-01-02", periods=6, freq="B")
    market = pd.DataFrame(
        {
            "date": list(dates) * 2,
            "symbol": ["AAA"] * 6 + ["SPY"] * 6,
            "adjusted_close": [100, 101, 102, 103, 104, 110, 200, 200, 200, 200, 200, 220],
        }
    )
    labels = build_forward_return_labels(market, horizon_days=5)

    aaa = labels[labels["symbol"] == "AAA"].reset_index(drop=True)
    spy = labels[labels["symbol"] == "SPY"].reset_index(drop=True)
    assert aaa.loc[0, "forward_return_5d"] == pytest.approx(0.10)
    assert spy.loc[0, "forward_return_5d"] == pytest.approx(0.10)
    assert labels.groupby("symbol")["forward_return_5d"].tail(5).isna().all()


def test_labels_reject_duplicate_keys_and_invalid_horizon(backtest_market_frame):
    duplicate = pd.concat([backtest_market_frame, backtest_market_frame.iloc[[0]]])
    with pytest.raises(ValueError, match="duplicate"):
        build_forward_return_labels(duplicate)
    with pytest.raises(ValueError, match="horizon_days"):
        build_forward_return_labels(backtest_market_frame, horizon_days=0)