import pandas as pd
import pytest

from ml.backtesting.base import prepare_market_data, prepare_signal_frame

def test_prepare_market_data_sorts_and_rejects_duplicate_keys(backtest_market_frame):
    prepared = prepare_market_data(backtest_market_frame.sample(frac=1, random_state=4))
    assert prepared[["symbol", "date"]].equals(
        prepared[["symbol", "date"]].sort_values(["symbol", "date"]).reset_index(drop=True)
    )
    
    duplicated = pd.concat([backtest_market_frame, backtest_market_frame.iloc[[0]]])
    
    with pytest.raises(ValueError, match="duplicate"):
        prepare_market_data(duplicated)
        
def test_prepare_signal_frame_rejects_weight_outside_long_only_range(backtest_market_frame):
    signals = backtest_market_frame[["date", "symbol"]].copy()
    signals["signal"] = 1.1
    with pytest.raises(ValueError, match="between 0 and 1"):
        prepare_signal_frame(signals)


def test_prepare_market_data_rejects_missing_or_non_finite_return(backtest_market_frame):
    with pytest.raises(ValueError, match="return_1d"):
        prepare_market_data(backtest_market_frame.drop(columns="return_1d"))

    broken = backtest_market_frame.copy()
    broken.loc[1, "return_1d"] = float("inf")
    with pytest.raises(ValueError, match="finite"):
        prepare_market_data(broken)