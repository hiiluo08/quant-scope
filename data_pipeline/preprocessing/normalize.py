import pandas as pd
import numpy as np 
from pathlib import Path

def normalize_ohlcv(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transform raw OHLCV DataFrame into processed schema.
    Input: df with columns: [date, symbol, open, high, low, close, adjusted_close, volume, source, ingested_at]
    Output: df with columns: [date, symbol, adjusted_close, volume, return_1d, log_return_1d, is_valid]
    """

    df = df.copy()
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(['symbol', 'date']).reset_index(drop=True)
    df['return_1d'] = df.groupby('symbol')['adjusted_close'].pct_change()
    df['log_return_1d'] = np.log1p(df['return_1d'])
    df['is_valid'] = (df["adjusted_close"].notna() & df["volume"].notna() & (df["volume"] > 0) & df["return_1d"].notna())
    df['processed_at'] = pd.Timestamp.now(tz='UTC')
    return df[["date", "symbol", "open", "high", "low", "close", "adjusted_close", "volume", 
               "return_1d", "log_return_1d","is_valid", "source", "processed_at"]]

def save_parquet(df: pd.DataFrame, path: str | Path) -> None:
    """ Save DataFrame to Parquet file. Creates parent directories if needed. """
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(path, index=False)

def load_parquet(path: str | Path) -> pd.DataFrame:
    """ Load DataFrame from Parquet file """
    return pd.read_parquet(path)

if __name__ == "__main__":
    from data_pipeline.ingestion.download import download_multiple_tickers
    raw = download_multiple_tickers(["SPY", "AAPL"], "2022-01-01", "2024-12-31")
    processed = normalize_ohlcv(raw)
    print(processed.head())
    print(processed.dtypes)
    print(f"Valid rows: {processed['is_valid'].sum()} / {len(processed)}")
    save_parquet(processed, "data/processed/ohlcv_daily.parquet")
    loaded = load_parquet("data/processed/ohlcv_daily.parquet")
    print(f"Loaded {len(loaded)} rows from Parquet")