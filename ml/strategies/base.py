from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path

import pandas as pd

from ml.factors.storage import load_factor_values

class Strategy(ABC):
    name: str
    required_factor_name: str
    
    @abstractmethod
    def generate_signals(self, factor_values: pd.DataFrame) -> pd.DataFrame:
        """ Return unique date, symbol, signal rows; engine shifts them later. """
        
def load_single_factor(factor_name: str, root: Path | None = None) -> pd.DataFrame:
    values = load_factor_values(factor_name) if root is None else load_factor_values(factor_name, root=root)
    return values.loc[values["factor_name"] == factor_name].copy()