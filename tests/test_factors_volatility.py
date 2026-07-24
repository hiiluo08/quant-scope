import pandas as pd
import pytest

from ml.factors.volatility import VolatilityFactor

def test_volatility_matches_pandas_rolling_std(ohlcv_frame):
    factor = VolatilityFactor(window=20)
    values = factor.compute(ohlcv_frame)
    prepared = ohlcv_frame.sort_values(["symbol", "date"]).reset_index(drop=True)
    expected = prepared.groupby("symbol", sort=False)["return_1d"].transform(
        lambda returns: returns.rolling(20, min_periods=20).std(ddof=1)
    )
    
    pd.testing.assert_series_equal(values, expected, check_names=False)
    

def test_volatility_rejects_invalid_window():
    with pytest.raises(ValueError, match="at least 2"):
        VolatilityFactor(window=1)