import pandas as pd
import pytest

from ml.features.build_dataset import FEATURE_COLUMNS, build_feature_dataset


def _factor_frame(name: str, values: list[float]) -> pd.DataFrame:
    return pd.DataFrame(
        {
            "date": pd.date_range("2024-01-02", periods=2, freq="B"),
            "symbol": ["AAA", "AAA"],
            "factor_name": [name, name],
            "factor_value": values,
            "factor_version": ["v1", "v1"],
            "computed_at": ["2026-07-25T00:00:00Z"] * 2,
        }
    )


def test_dataset_pivots_exact_feature_set_and_drops_incomplete_rows(tmp_path, monkeypatch):
    from ml.factors.storage import save_factor_values

    for index, name in enumerate(FEATURE_COLUMNS):
        values = [float(index), float(index + 1)]
        if name == "rsi_14":
            values[0] = float("nan")
        save_factor_values(_factor_frame(name, values), name, root=tmp_path)

    labels = pd.DataFrame(
        {
            "date": pd.date_range("2024-01-02", periods=2, freq="B"),
            "symbol": ["AAA", "AAA"],
            "forward_return_5d": [0.01, 0.02],
        }
    )
    dataset, versions = build_feature_dataset(labels, factors_root=tmp_path)

    assert list(dataset.columns) == ["date", "symbol", *FEATURE_COLUMNS, "forward_return_5d"]
    assert len(dataset) == 1
    assert versions == {name: "v1" for name in FEATURE_COLUMNS}


def test_dataset_rejects_multiple_versions_for_one_feature(tmp_path):
    from ml.factors.storage import save_factor_values

    for name in FEATURE_COLUMNS:
        frame = _factor_frame(name, [1.0, 2.0])
        if name == "momentum_20d":
            frame.loc[1, "factor_version"] = "v2"
        save_factor_values(frame, name, root=tmp_path)

    labels = pd.DataFrame(
        {
            "date": pd.date_range("2024-01-02", periods=2, freq="B"),
            "symbol": ["AAA", "AAA"],
            "forward_return_5d": [0.01, 0.02],
        }
    )
    with pytest.raises(ValueError, match="exactly one version"):
        build_feature_dataset(labels, factors_root=tmp_path)