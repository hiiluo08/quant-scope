from __future__ import annotations

import pandas as pd

from ml.strategies.base import Strategy

class MomentumLongOnlyStrategy(Strategy):
    name = "momentum_long_only_v1"
    required_factor_name = "momentum_20d"
    
    def generate_signals(self, factor_values: pd.DataFrame) -> pd.DataFrame:
        values = factor_values.loc[
            factor_values["factor_name"] == self.required_factor_name,
            ["date", "symbol", "factor_value"]
        ].dropna(subset=["factor_value"])
        
        result = values[["date", "symbol"]].copy()
        result["signal"] = (values["factor_value"] > 0.0).astype(float)
        return result.sort_values(["symbol", "date"]).reset_index(drop=True)