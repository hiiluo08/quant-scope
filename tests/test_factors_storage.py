import pandas as pd
import pytest

from ml.factors.momentum import MomentumFactor
from ml.factors.storage import (
    build_factor_frame,
    factor_values_path,
    load_factor_values,
    save_factor_values,
)


def test_factor_storage_round_trip(ohlcv_frame, tmp_path):
    frame = build_factor_frame(MomentumFactor(20), ohlcv_frame)
    path = save_factor_values(frame, "momentum_20d", root=tmp_path)

    assert path == factor_values_path("momentum_20d", tmp_path)
    pd.testing.assert_frame_equal(load_factor_values("momentum_20d", tmp_path), frame)


def test_factor_storage_rejects_duplicate_logical_key(ohlcv_frame, tmp_path):
    frame = build_factor_frame(MomentumFactor(20), ohlcv_frame)
    duplicate = pd.concat([frame, frame.iloc[[0]]], ignore_index=True)

    with pytest.raises(ValueError, match="duplicate logical keys"):
        save_factor_values(duplicate, "momentum_20d", root=tmp_path)


def test_load_missing_factor_raises_file_not_found(tmp_path):
    with pytest.raises(FileNotFoundError, match="not found"):
        load_factor_values("momentum_20d", root=tmp_path)
        

from data_pipeline.jobs.rebuild_universe import compute_and_store_default_factors


def test_default_factor_batch_writes_files(ohlcv_frame, tmp_path):
    processed_path = tmp_path / "processed.parquet"
    ohlcv_frame.to_parquet(processed_path, index=False)

    paths = compute_and_store_default_factors(processed_path, factors_root=tmp_path / "factors")

    assert len(paths) == 12
    assert {path.parent.name for path in paths} == {
        "factor_name=momentum_20d",
        "factor_name=momentum_60d",
        "factor_name=volatility_20d",
        "factor_name=rsi_14",
        "factor_name=sma_ratio_20_50",
        "factor_name=volume_zscore_20d",
        "factor_name=macd_12_26",
        "factor_name=macd_signal_12_26_9",
        "factor_name=bollinger_width_20",
        "factor_name=lag_return_1d",
        "factor_name=lag_return_2d",
        "factor_name=lag_return_3d",
    }