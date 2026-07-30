"""Tests for the Data Quality Gate module."""
import pandas as pd
import numpy as np
import pytest
from data_pipeline.processing.quality_gate import run_quality_gate


def _make_valid_row(**overrides):
    base = {
        "date": pd.Timestamp("2024-01-15"),
        "symbol": "AAPL", "open": 150.0, "high": 155.0,
        "low": 148.0, "close": 153.0, "adjusted_close": 153.0,
        "volume": 1_000_000, "source": "yfinance",
        "ingested_at": "2024-01-15T22:00:00+00:00",
    }
    base.update(overrides)
    return base


class TestQualityGateCleanData:
    def test_all_clean_rows_pass(self):
        df = pd.DataFrame([_make_valid_row(symbol=s) for s in ("AAPL", "MSFT", "GOOGL")])
        clean, quarantined, report = run_quality_gate(df)
        assert len(clean) == 3
        assert len(quarantined) == 0
        assert report.pass_rate == 1.0

    def test_report_checks_all_zero(self):
        df = pd.DataFrame([_make_valid_row()])
        _, _, report = run_quality_gate(df)
        assert all(v == 0 for v in report.checks.values())


class TestQualityGateQuarantine:
    def test_negative_price_quarantined(self):
        df = pd.DataFrame([
            _make_valid_row(symbol="AAPL"),
            _make_valid_row(symbol="BAD", adjusted_close=-5.0),
        ])
        clean, quarantined, report = run_quality_gate(df)
        assert len(clean) == 1
        assert len(quarantined) == 1
        assert report.checks["negative_prices"] == 1
        assert "quarantine_reason" in quarantined.columns

    def test_null_volume_quarantined(self):
        df = pd.DataFrame([
            _make_valid_row(symbol="AAPL"),
            _make_valid_row(symbol="BAD", volume=None),
        ])
        clean, quarantined, _ = run_quality_gate(df)
        assert len(quarantined) == 1

    def test_duplicate_rows_quarantined(self):
        row = _make_valid_row()
        df = pd.DataFrame([row, row])
        clean, quarantined, report = run_quality_gate(df)
        assert len(clean) == 1
        assert report.checks["duplicate_rows"] == 1

    def test_high_less_than_low_quarantined(self):
        df = pd.DataFrame([_make_valid_row(high=100.0, low=200.0)])
        _, quarantined, report = run_quality_gate(df)
        assert len(quarantined) == 1
        assert report.checks["ohlc_inconsistency"] == 1


class TestQualityGateSchemaValidation:
    def test_missing_columns_raises(self):
        df = pd.DataFrame({"date": ["2024-01-01"], "symbol": ["X"]})
        with pytest.raises(ValueError, match="missing columns"):
            run_quality_gate(df)
