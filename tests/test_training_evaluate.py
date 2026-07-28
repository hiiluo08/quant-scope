import pandas as pd
import pytest

from ml.training.evaluate import evaluate_predictions, select_champion


def test_evaluate_predictions_returns_regression_rank_and_direction_metrics():
    frame = pd.DataFrame(
        {"forward_return_5d": [0.10, -0.10, 0.20], "prediction": [0.05, -0.02, 0.10]}
    )
    metrics = evaluate_predictions(frame)
    assert metrics["rmse"] > 0
    assert metrics["mae"] > 0
    assert metrics["rank_ic"] == pytest.approx(1.0)
    assert metrics["directional_accuracy"] == pytest.approx(1.0)


def test_champion_uses_rmse_then_rank_ic_tie_break():
    candidates = {
        "xgboost": {"rmse": 0.10, "rank_ic": 0.20},
        "lightgbm": {"rmse": 0.10, "rank_ic": 0.30},
    }
    assert select_champion(candidates) == "lightgbm"