from __future__ import annotations

from abc import ABC, abstractmethod

import pandas as pd

REQUIRED_FACTOR_COLUMNS = frozenset({
    "date", "symbol", "adjusted_close", "volume", "return_1d"
})

FACTOR_OUTPUT_COLUMNS = [
    "date", "symbol", "factor_name", "factor_value", "factor_version", "computed_at"
]

def prepare_factor_input(df: pd.DataFrame) -> pd.DataFrame:
    """ Validate and deterministically sort processed OHLCV before computing factors. """
    missing = sorted(REQUIRED_FACTOR_COLUMNS - set(df.columns))
    if missing:
        raise ValueError(f"Missing required factor columns: {', '.join(missing)}")
    
    prepared = df.copy()
    prepared["date"] = pd.to_datetime(prepared["date"])
    if prepared.duplicated(["date", "symbol"]).any():
        raise ValueError("Input contains duplicate date and symbol rows")
    return prepared.sort_values(["symbol", "date"]).reset_index(drop=True)

class Factor(ABC):
    """ Base contract for a casual factor computed independently per symbol. """
    name: str
    version = "v1"
    warmup_periods: int
    
    @abstractmethod
    def compute(self, df: pd.DataFrame) -> pd.Series:
        """ Return one aligned factor-value series after 'prepare_factor_input(df)'. """
        
    def metadata(self) -> dict[str, object]:
        return {
            "name": self.name,
            "version": self.version,
            "warmup_periods": self.warmup_periods
        }