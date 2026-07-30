"""Data Quality Gate — validates and quarantines bad data before processing."""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone

import pandas as pd

logger = logging.getLogger(__name__)


@dataclass
class QualityReport:
    """Immutable report from a quality gate run."""
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    total_rows: int = 0
    passed_rows: int = 0
    quarantined_rows: int = 0
    checks: dict[str, int] = field(default_factory=dict)

    @property
    def pass_rate(self) -> float:
        return self.passed_rows / self.total_rows if self.total_rows else 0.0


# --------------- Individual check functions ---------------

REQUIRED_SCHEMA = [
    "date", "symbol", "open", "high", "low", "close",
    "adjusted_close", "volume", "source", "ingested_at",
]


def check_schema(df: pd.DataFrame) -> list[str]:
    """Return list of missing required columns."""
    return sorted(set(REQUIRED_SCHEMA) - set(df.columns))


def check_nulls(df: pd.DataFrame) -> pd.Series:
    """Boolean mask — True for rows with null in critical fields."""
    critical = ["date", "symbol", "adjusted_close", "volume"]
    return df[critical].isnull().any(axis=1)


def check_negative_prices(df: pd.DataFrame) -> pd.Series:
    """Boolean mask — True for rows with non-positive prices."""
    return (df["adjusted_close"] <= 0) | (df["close"] <= 0)


def check_zero_volume(df: pd.DataFrame) -> pd.Series:
    """Boolean mask — True for zero-volume rows."""
    return df["volume"] == 0


def check_duplicates(df: pd.DataFrame) -> pd.Series:
    """Boolean mask — True for duplicate (date, symbol) rows."""
    return df.duplicated(subset=["date", "symbol"], keep="first")


def check_ohlc_consistency(df: pd.DataFrame) -> pd.Series:
    """Boolean mask — True for OHLC inconsistencies (high < low)."""
    return df["high"] < df["low"]


# --------------- Gate orchestrator ---------------

def run_quality_gate(
    raw_df: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame, QualityReport]:
    """
    Run all quality checks on raw OHLCV data.

    Returns:
        (clean_df, quarantined_df, report)
    """
    missing_cols = check_schema(raw_df)
    if missing_cols:
        raise ValueError(f"Schema validation failed — missing columns: {missing_cols}")

    df = raw_df.copy()
    quarantine_mask = pd.Series(False, index=df.index)

    checks: dict[str, int] = {}
    for name, check_fn in [
        ("null_critical_fields", check_nulls),
        ("negative_prices", check_negative_prices),
        ("zero_volume", check_zero_volume),
        ("duplicate_rows", check_duplicates),
        ("ohlc_inconsistency", check_ohlc_consistency),
    ]:
        flagged = check_fn(df)
        count = int(flagged.sum())
        checks[name] = count
        if count > 0:
            logger.warning(f"Quality check '{name}': {count} rows flagged")
        quarantine_mask |= flagged

    clean_df = df[~quarantine_mask].reset_index(drop=True)
    quarantined_df = df[quarantine_mask].reset_index(drop=True)

    if not quarantined_df.empty:
        quarantined_df = quarantined_df.copy()
        quarantined_df["quarantine_reason"] = "quality_gate"
        quarantined_df["quarantined_at"] = datetime.now(timezone.utc).isoformat()

    report = QualityReport(
        total_rows=len(df),
        passed_rows=len(clean_df),
        quarantined_rows=len(quarantined_df),
        checks=checks,
    )

    logger.info(
        f"Quality Gate: {report.passed_rows}/{report.total_rows} passed "
        f"({report.pass_rate:.1%}), {report.quarantined_rows} quarantined"
    )
    return clean_df, quarantined_df, report
