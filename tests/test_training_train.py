import pandas as pd

from ml.features.build_dataset import FEATURE_COLUMNS
from ml.training.split import split_dataset
from ml.training.train import train_baseline_models


def test_train_baseline_models_returns_both_families_and_aligned_predictions():
    dates = pd.date_range("2023-01-02", periods=40, freq="B")
    dataset = pd.DataFrame(
        {
            "date": list(dates) * 2,
            "symbol": ["AAA"] * 40 + ["SPY"] * 40,
            **{name: [index + day / 100 for day in range(40)] * 2 for index, name in enumerate(FEATURE_COLUMNS)},
            "forward_return_5d": [day / 1000 for day in range(40)] * 2,
        }
    )
    trained = train_baseline_models(split_dataset(dataset), FEATURE_COLUMNS)

    assert set(trained) == {"xgboost", "lightgbm"}
    for item in trained.values():
        assert set(item.validation_predictions.columns) >= {"date", "symbol", "prediction", "forward_return_5d"}
        assert set(item.test_predictions.columns) >= {"date", "symbol", "prediction", "forward_return_5d"}