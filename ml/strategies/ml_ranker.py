from __future__ import annotations

import pandas as pd

class MLTopKRankStrategy:
    name = "ml_top_5_rank_v1"
    
    def __init__(self, top_k: int = 5) -> None:
        if top_k < 1:
            raise ValueError("top_k must be greater than 0")
        self.top_k = top_k
        
    def generate_signals(self, predictions: pd.DataFrame) -> pd.DataFrame:
        required = {"date", "symbol", "prediction"}
        missing = sorted(required - set(predictions.columns))
        if missing:
            raise ValueError(f"predictions is missing required columns: {', '.join(missing)}")
        
        frame = predictions[["date", "symbol", "prediction"]].copy()
        frame["date"] = pd.to_datetime(frame["date"])
        if frame.duplicated(["date", "symbol"]).any():
            raise ValueError("predictions contains duplicate date and symbol rows")
        frame = frame.sort_values(["date", "prediction", "symbol"], ascending=[True, False, True])
        frame["rank"] = frame.groupby("date").cumcount() + 1
        frame["signal"] = (frame["rank"] <= self.top_k).astype(float)
        return frame.sort_values(["date", "symbol"])[["date", "symbol", "signal"]].reset_index(drop=False)