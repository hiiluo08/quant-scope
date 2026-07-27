from __future__ import annotations

import pandas as pd

from ml.strategies.base import Strategy

class RSIMeanReversionStrategy(Strategy):
    name = "rsi_mean_reversion_v1"
    required_factor_name = "rsi_14"
    entry_threshold = 30.0
    exit_threshold = 55.0
    
    def generate_signals(self, factor_values: pd.DataFrame) -> pd.DataFrame:
        values = factor_values.loc[
            factor_values["factor_name"] == self.required_factor_name,
            ["date", "symbol", "factor_value"]
        ].dropna(subset=["factor_value"])
        values = values.sort_values(["symbol", "date"]).reset_index(drop=True)
        
        def apply_rules(group: pd.DataFrame) -> pd.DataFrame:
            position = 0.0
            signals: list[float] = []
            
            for value in group["factor_value"]:
                if position == 0.0 and value <= self.entry_threshold:
                    position = 1.0
                elif position == 1.0 and value >= self.exit_threshold:
                    position = 0.0
                signals.append(position)
            
            result = group[["date"]].copy()
            result["symbol"] = group.name if "symbol" not in group.columns else group["symbol"]
            result["signal"] = signals
            return result[["date", "symbol", "signal"]]

        return (
            values.groupby("symbol", group_keys=False, sort=False)
            .apply(apply_rules)
            .reset_index(drop=True)
        )