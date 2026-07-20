import pandas as pd
import logging

logger = logging.getLogger(__name__)

def validate_ohlcv(df: pd.DataFrame) -> dict:
    """
    Run data quality checks on processed OHLCV DataFrame.
    Returns a report dict with counts of issues found.
    """

    report = {}
    missing = df[["date", "symbol", "adjusted_close", "volume"]].isnull().sum()
    report["missing_values"] = missing[missing > 0].to_dict()
    dups = df.duplicated(subset=["date", "symbol"]).sum()
    report["duplicate_rows"] = int(dups)
    zero_vol = (df["volume"] == 0).sum()
    report["zero_volume_rows"] = int(zero_vol)
    negative_price = (df["adjusted_close"] <= 0).sum()
    report["negative_or_zero_price"] = int(negative_price)
    extreme_returns = df["return_1d"].abs() > 0.5
    report["extreme_return_rows"] = int(extreme_returns.sum())
    if report.get("missing_values"):
        logger.warning(f"Missing values found: {report['missing_values']}")
    if dups > 0:
        logger.warning(f"Duplicate rows found: {dups}")
    if zero_vol > 0:
        logger.info(f"Zero-volume rows: {zero_vol} (may be holidays)")
    if report["extreme_return_rows"] > 0:
        logger.warning(f"Extreme returns (>50%) found: {report['extreme_return_rows']} rows")
    return report

if __name__ == "__main__":
    from data_pipeline.storage.local_store import load_processed

    START, END = "2022-01-01", "2024-12-31"
    df = load_processed(START, END)
    if df is not None:
        report = validate_ohlcv(df)
        print("Validation report:")
        for k, v in report.items():
            print(f"  {k}: {v}")
    else:
        print(
            f"No processed data found for {START} to {END}. "
            "Run 'python -m data_pipeline.processing.normalize' first."
        )