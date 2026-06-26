import pandas as pd
import yfinance as yf
import logging
from datetime import datetime, timezone
from typing import List


logger = logging.getLogger(__name__)

def download_ticker(symbol: str, start_date: str, end_date: str, source: str = 'yfinance') -> pd.DataFrame:
    """ Download raw OHLCV from source
    Args:
        symbol (str): Ticker symbol (e.g. 'AAPL')
        start_date (str): Start date (YYYY-MM-DD)
        end_date (str): End date (YYYY-MM-DD)
    Returns:
        pd.DataFrame: Raw OHLCV data
    """

    logger.info(f'Downloading {symbol} from {start_date} to {end_date}...')
    ticker = yf.Ticker(symbol)
    raw = ticker.history(start=start_date, end=end_date, auto_adjust=False)
    if raw.empty:
        raise ValueError(f'No data found for {symbol} between {start_date} and {end_date}!')
    df = raw.reset_index()
    df.columns = df.columns.str.lower().str.replace(" ", "_")
    df = df.rename(columns={"adj_close": "adjusted_close"})
    df["symbol"] = symbol.upper()
    df["source"] = source
    df["date"] = pd.to_datetime(df["date"]).dt.date
    df["ingested_at"] = datetime.now(timezone.utc).isoformat()
    return df[["date", "symbol", "open", "high", "low", "close", "adjusted_close", "volume", "source", "ingested_at"]]

def download_multiple_tickers(symbols: List[str], start_date: str, end_date: str) -> pd.DataFrame:
    frames = []
    errors = []

    for symbol in symbols:
        try:
            df = download_ticker(symbol, start_date, end_date)
            frames.append(df)
        except Exception as e:
            logger.warning(f'Failed to download {symbol}: {e}')
            errors.append(symbol)

    if errors:
        logger.warning(f"Skipped tickers: {errors}")

    if not frames:
        raise RuntimeError('No data downloaded for any ticker!')
    
    return pd.concat(frames, ignore_index=True)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    TICKERS = ["SPY", "QQQ", "AAPL", "MSFT", "TSLA"]
    df = download_multiple_tickers(TICKERS, "2022-01-01", "2024-12-31")
    print(df.head())
    print(f"Total rows: {len(df)}")
    print(f"Symbols: {df['symbol'].unique()}")
    
    