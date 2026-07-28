import pandas as pd

from ml.features.build_dataset import FEATURE_COLUMNS
from ml.training.split import split_dataset
from ml.training.storage import load_model_manifest, load_predictions, save_model_artifact
from ml.training.train import train_baseline_models


def test_model_storage_round_trip_uses_native_artifact_and_prediction_parquet(tmp_path):
    dates = pd.date_range("2023-01-02", periods=40, freq="B")
    dataset = pd.DataFrame(
        {
            "date": list(dates) * 2,
            "symbol": ["AAA"] * 40 + ["SPY"] * 40,
            **{name: [index + day / 100 for day in range(40)] * 2 for index, name in enumerate(FEATURE_COLUMNS)},
            "forward_return_5d": [day / 1000 for day in range(40)] * 2,
        }
    )
    trained = train_baseline_models(split_dataset(dataset), FEATURE_COLUMNS)["xgboost"]
    manifest = {
        "family": "xgboost", "feature_columns": list(FEATURE_COLUMNS),
        "factor_versions": {name: "v1" for name in FEATURE_COLUMNS},
        "label": {"name": "forward_return_5d", "horizon_days": 5},
        "split_dates": {"train_end": "2023-02-01", "validation_end": "2023-02-15", "test_start": "2023-02-23"},
        "parameters": trained.parameters,
        "metrics": {"validation": trained.validation_metrics, "test": trained.test_metrics},
    }
    path = save_model_artifact(trained, manifest, root=tmp_path)
    model_id = path.name.removeprefix("model_id=")

    loaded_manifest = load_model_manifest(model_id, root=tmp_path)
    test_predictions = load_predictions(model_id, "test", root=tmp_path)
    assert loaded_manifest["model_id"] == model_id
    assert (path / "model.json").exists()
    assert set(test_predictions.columns) >= {"model_id", "prediction", "forward_return_5d"}