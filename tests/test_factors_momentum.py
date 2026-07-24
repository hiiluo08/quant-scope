import numpy as np
import pandas as pd
import pytest

from ml.factors.momentum import MomentumFactor

def test_momentum_uses_price_n_sessions_earlier(ohlcv_frame):
    factor = MomentumFactor(window=20)
    values = factor.compute(ohlcv_frame)
    prepared = ohlcv_frame.sort_values(["symbol", "date"]).reset_index(drop=True)
    aaa = prepared[prepared["symbol"] == "AAA"].reset_index(drop=True)
    
    assert values.loc[0:19].isna().all()
    assert values.loc[20] == (aaa.loc[20, "adjusted_close"] / aaa.loc[0, "adjusted_close"]) - 1
    
def test_momentum_does_not_mix_symbols():
    df = pd.DataFrame({
        "date": list(pd.date_range("2024-01-01", periods=3, freq="B")) * 2,
        "symbol": ["AAA"] * 3 + ["BBB"] * 3,
        "adjusted_close": [10.0, 11.0, 12.0, 100.0, 200.0, 300.0],
        "volume": 1_000,
        "return_1d": [np.nan, 0.1, 1/11, np.nan, 1.0, 0.5]
    })
    
    values = MomentumFactor(window=1).compute(df)
    
    assert pd.isna(values.iloc[0])
    assert values.iloc[1] == pytest.approx(0.1)
    assert values.iloc[2] == pytest.approx(1/11)
    assert pd.isna(values.iloc[3])
    assert values.iloc[4] == pytest.approx(1.0)
    assert values.iloc[5] == pytest.approx(0.5)