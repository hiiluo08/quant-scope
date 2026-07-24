import numpy as np
import pandas as pd

from ml.factors.volume import VolumeZScoreFactor

def test_volume_zscore_matches_rolling_formula(ohlcv_frame):
    factor = VolumeZScoreFactor(window=20)
    values = factor.compute(ohlcv_frame)
    prepared = ohlcv_frame.sort_values(["symbol", "date"]).reset_index(drop=True)
    expected = prepared.groupby("symbol", sort=False)["volume"].transform(
        lambda volume: (volume - volume.rolling(20, min_periods=20).mean()) / volume.rolling(20, min_periods=20).std(ddof=1)
    )

    pd.testing.assert_series_equal(values, expected.replace([np.inf, -np.inf], np.nan), check_names=False)
    
def test_volume_zscore_returns_nan_for_constant_volume(ohlcv_frame):
    ohlcv_frame["volume"] = 1000
    values = VolumeZScoreFactor(window=20).compute(ohlcv_frame)
    
    assert values.isna().all()