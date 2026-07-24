import pandas as pd
import pytest

from ml.factors.base import prepare_factor_input

def test_prepare_factor_input_sorts_each_symbol_and_date(ohlcv_frame):
    prepared = prepare_factor_input(ohlcv_frame.sample(frac=1, random_state=7))
    
    assert prepared[["symbol", "date"]].equals(
        prepared[["symbol", "date"]].sort_values(["symbol", "date"]).reset_index(drop=True)
    )

def test_prepare_factor_input_rejects_duplicate_symbol_date(ohlcv_frame):
    duplicated = pd.concat([ohlcv_frame, ohlcv_frame.iloc[[0]]], ignore_index=True)
    
    with pytest.raises(ValueError, match="duplicate"):
        prepare_factor_input(duplicated)
    

def test_prepare_factor_input_rejects_missing_required_column(ohlcv_frame):
    with pytest.raises(ValueError, match="volume"):
        prepare_factor_input(ohlcv_frame.drop(columns="volume"))