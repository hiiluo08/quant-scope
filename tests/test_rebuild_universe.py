from __future__ import annotations

import pandas as pd
import pytest

from data_pipeline.jobs.rebuild_universe import UNIVERSE_TICKERS, rebuild_universe
from data_pipeline.storage.local_store import s3_factor_key


def test_s3_factor_key_mirrors_factor_storage_layout():
    assert s3_factor_key("momentum_20d") == "factors/factor_name=momentum_20d/values.parquet"


def _raw_frame(symbols: tuple[str, ...], periods: int = 523) -> pd.DataFrame:
    dates = pd.date_range("2023-01-03", periods=periods, freq="B")
    frames = []
    for index, symbol in enumerate(symbols):
        close = 100 + index + pd.Series(range(periods), dtype="float64")
        frames.append(
            pd.DataFrame(
                {
                    "date": dates,
                    "symbol": symbol,
                    "open": close - 0.5,
                    "high": close + 1,
                    "low": close - 1,
                    "close": close,
                    "adjusted_close": close,
                    "volume": 1_000_000,
                    "source": "fixture",
                    "ingested_at": "2026-07-24T00:00:00Z",
                }
            )
        )
    return pd.concat(frames, ignore_index=True)


def test_rebuild_saves_valid_complete_universe(tmp_path, monkeypatch):
    raw = _raw_frame(UNIVERSE_TICKERS)
    monkeypatch.setattr(
        "data_pipeline.jobs.rebuild_universe.download_multiple_tickers",
        lambda symbols, start_date, end_date: raw,
    )
    output = tmp_path / "ohlcv_20230101_20260101.parquet"

    result = rebuild_universe("2023-01-01", "2026-01-01", output)

    assert output.exists()
    assert set(result["symbol"].unique()) == set(UNIVERSE_TICKERS)
    assert result.groupby("symbol")["date"].nunique().min() >= 252
    assert result.duplicated(["date", "symbol"]).sum() == 0


def test_rebuild_rejects_missing_symbol(tmp_path, monkeypatch):
    raw = _raw_frame(UNIVERSE_TICKERS[:-1])
    monkeypatch.setattr(
        "data_pipeline.jobs.rebuild_universe.download_multiple_tickers",
        lambda symbols, start_date, end_date: raw,
    )

    with pytest.raises(ValueError, match="Missing symbols"):
        rebuild_universe("2023-01-01", "2026-01-01", tmp_path / "output.parquet")


def test_rebuild_rejects_insufficient_history(tmp_path, monkeypatch):
    raw = _raw_frame(UNIVERSE_TICKERS, periods=200)
    monkeypatch.setattr(
        "data_pipeline.jobs.rebuild_universe.download_multiple_tickers",
        lambda symbols, start_date, end_date: raw,
    )

    with pytest.raises(ValueError, match="at least 252 trading rows"):
        rebuild_universe("2023-01-01", "2026-01-01", tmp_path / "output.parquet")