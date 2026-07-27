import pandas as pd
import pytest

from ml.training.split import split_dataset


def _dataset(days: int = 30) -> pd.DataFrame:
    dates = pd.date_range("2024-01-02", periods=days, freq="B")
    return pd.DataFrame(
        {
            "date": list(dates) * 2,
            "symbol": ["AAA"] * days + ["SPY"] * days,
            "momentum_20d": 0.1,
            "forward_return_5d": 0.01,
        }
    )


def test_split_is_date_disjoint_ordered_and_has_five_date_embargo():
    split = split_dataset(_dataset(), embargo_days=5)
    assert max(split.train_dates) < min(split.validation_dates) < min(split.test_dates)
    all_dates = set(split.train_dates) | set(split.validation_dates) | set(split.test_dates)
    assert len(all_dates) == len(split.train_dates) + len(split.validation_dates) + len(split.test_dates)
    source_dates = _dataset()["date"].drop_duplicates().sort_values().tolist()
    train_last_index = source_dates.index(max(split.train_dates))
    validation_first_index = source_dates.index(min(split.validation_dates))
    validation_last_index = source_dates.index(max(split.validation_dates))
    test_first_index = source_dates.index(min(split.test_dates))
    assert validation_first_index - train_last_index == 6
    assert test_first_index - validation_last_index == 6


def test_split_rejects_too_few_dates_for_two_embargoes():
    with pytest.raises(ValueError, match="not enough unique dates"):
        split_dataset(_dataset(days=12), embargo_days=5)