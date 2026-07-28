import pandas as pd

from ml.strategies.ml_ranker import MLTopKRankStrategy


def test_top_k_ranker_selects_five_and_breaks_ties_by_symbol():
    predictions = pd.DataFrame(
        {
            "date": [pd.Timestamp("2024-01-02")] * 6,
            "symbol": ["F", "E", "D", "C", "B", "A"],
            "prediction": [0.5, 0.5, 0.4, 0.3, 0.2, 0.1],
        }
    )
    signals = MLTopKRankStrategy(top_k=5).generate_signals(predictions)
    assert signals.loc[signals["signal"] == 1.0, "symbol"].tolist() == ["B", "C", "D", "E", "F"]
    assert signals.loc[signals["signal"] == 0.0, "symbol"].tolist() == ["A"]