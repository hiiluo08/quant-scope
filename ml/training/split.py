from __future__ import annotations

from dataclasses import dataclass

import pandas as pd

@dataclass(frozen=True)
class TemporalSplit:
    train: pd.DataFrame
    validation: pd.DataFrame
    test: pd.DataFrame
    train_dates: tuple[pd.Timestamp, ...]
    validation_dates: tuple[pd.Timestamp, ...]
    test_dates: tuple[pd.Timestamp, ...]
    
def split_dataset(dataset: pd.DataFrame, embargo_days: int = 5) -> TemporalSplit:
    if embargo_days < 0:
        raise ValueError("dataset must include date and embargo_days must be non-negative")
    
    frame = dataset.copy()
    frame["date"] = pd.to_datetime(frame["date"])
    dates = sorted(frame["date"].unique())
    minimum_dates = 3 + 2 * embargo_days
    if len(dates) < minimum_dates:
        raise ValueError("not enough unique dates for train, validation, test and embargo")
    
    train_boundary = int(len(dates) * 0.6)
    validation_boundary = int(len(dates) * 0.8)
    train_dates = tuple(dates[:train_boundary - embargo_days])
    validation_dates = tuple(dates[train_boundary : validation_boundary - embargo_days])
    test_dates = tuple(dates[validation_boundary:])
    
    if not train_dates or not validation_dates or not test_dates:
        raise ValueError("not enough unique dates after applying embargo")
    
    return TemporalSplit(
        train = frame[frame["date"].isin(train_dates)].copy(),
        validation = frame[frame["date"].isin(validation_dates)].copy(),
        test = frame[frame["date"].isin(test_dates)].copy(),
        train_dates = train_dates,
        validation_dates = validation_dates,
        test_dates = test_dates
    )