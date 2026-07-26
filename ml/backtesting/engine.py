from __future__ import annotations

import pandas as pd

from ml.backtesting.base import BacktestConfig, prepare_market_data, prepare_signal_frame

DAILY_RESULT_COLUMNS = ["date", "gross_return", "turnover", "transaction_cost", "net_return", "portfolio_exposure", "equity_curve"]

def _positions_from_signals(signals: pd.DataFrame) -> pd.DataFrame:
    shifted = signals.copy()
    shifted["raw_position"] = shifted.groupby("symbol", sort=False)["signal"].shift(1).fillna(0.0)
    active_count = shifted.groupby("date")["raw_position"].transform(lambda values: (values > 0).sum())
    shifted["position"] = 0.0
    active = active_count > 0
    shifted.loc[active, "position"] = shifted.loc[active, "raw_position"] / active_count.loc[active]

    return shifted[["date", "symbol", "position"]]

def run_backtest(market_data: pd.DataFrame, signals: pd.DataFrame, config: BacktestConfig) -> pd.DataFrame:
    market = prepare_market_data(market_data)
    signal_frame = prepare_signal_frame(signals)
    joined = market.merge(signal_frame, on=["date", "symbol"], how="inner", validate="one_to_one")

    if joined.empty:
        raise ValueError("market_data and signals have no overlapping date and symbol rows")
    
    positions = _positions_from_signals(joined[["date",  "symbol", "signal"]])
    joined = joined.merge(positions, on=["date", "symbol"], how="left", validate="one_to_one")
    joined = joined.sort_values(["symbol", "date"]).reset_index(drop=True)
    joined["previous_position"] = joined.groupby("symbol", sort=False)["position"].shift(1).fillna(0.0)
    joined["symbol_turnover"] = (joined["position"] - joined["previous_position"]).abs()

    daily = joined.groupby("date", as_index=False).agg(
        gross_return=("return_1d", lambda values: 0.0),
        turnover=("symbol_turnover", "sum"),
        portfolio_exposure=("position", "sum")
    ).sort_values("date").reset_index(drop=True)

    gross = (joined["position"] * joined["return_1d"]).groupby(joined["date"]).sum()
    daily["gross_return"] = daily["date"].map(gross).fillna(0.0)
    cost_rate = (config.transaction_cost_bps + config.slippage_bps) / 10_000
    daily["transaction_cost"] = daily["turnover"] * cost_rate
    daily["net_return"] = daily["gross_return"] - daily["transaction_cost"]
    daily["equity_curve"] = config.initial_equity * (1.0 + daily["net_return"]).cumprod()

    return daily.loc[:, DAILY_RESULT_COLUMNS].sort_values("date").reset_index(drop=True)