import numpy as np
import pandas as pd

from data_pipeline.jobs.run_ml_pipeline import run_ml_pipeline
from ml.features.build_dataset import FEATURE_COLUMNS
from ml.factors.storage import save_factor_values


def test_ml_runner_persists_two_models_and_one_ml_backtest(tmp_path):
    dates = pd.date_range("2023-01-02", periods=120, freq="B")
    market = pd.concat(
        [
            pd.DataFrame(
                {
                    "date": dates, "symbol": symbol,
                    "adjusted_close": start + np.arange(120, dtype=float),
                    "return_1d": [0.0] + [0.001] * 119, "is_valid": True,
                }
            )
            for symbol, start in (("AAA", 100.0), ("SPY", 200.0), ("BBB", 300.0), ("CCC", 400.0), ("DDD", 500.0), ("EEE", 600.0))
        ],
        ignore_index=True,
    )
    factors_root = tmp_path / "factors"
    for index, name in enumerate(FEATURE_COLUMNS):
        values = market[["date", "symbol"]].copy()
        values["factor_name"] = name
        values["factor_value"] = index + np.linspace(0.0, 1.0, len(values))
        values["factor_version"] = "v1"
        values["computed_at"] = "2026-07-25T00:00:00Z"
        save_factor_values(values, name, root=factors_root)

    outputs = run_ml_pipeline(
        market_data=market,
        factors_root=factors_root,
        models_root=tmp_path / "models",
        backtests_root=tmp_path / "backtests",
    )
    assert set(outputs["models"]) == {"xgboost", "lightgbm"}
    assert outputs["backtest"].exists()