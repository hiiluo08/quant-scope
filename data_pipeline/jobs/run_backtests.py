from __future__ import annotations

from pathlib import Path

import pandas as pd

from data_pipeline.storage.local_store import BACKTESTS_DIR, FACTORS_DIR
from ml.backtesting.base import BacktestConfig
from ml.backtesting.engine import run_backtest
from ml.backtesting.metrics import (
    build_equal_weight_benchmark,
    build_spy_benchmark,
    calculate_metrics,
)
from ml.backtesting.storage import save_backtest_result
from ml.strategies.base import load_single_factor
from ml.strategies.momentum import MomentumLongOnlyStrategy
from ml.strategies.rsi_reversion import RSIMeanReversionStrategy


def _run_one(market_data: pd.DataFrame, strategy: object, factors_root: Path, backtests_root: Path) -> Path:
    factor_values = load_single_factor(strategy.required_factor_name, root=factors_root)
    signals = strategy.generate_signals(factor_values)
    start_date = pd.to_datetime(market_data["date"]).min().strftime("%Y-%m-%d")
    end_date = pd.to_datetime(market_data["date"]).max().strftime("%Y-%m-%d")
    config = BacktestConfig(strategy_name=strategy.name, start_date=start_date, end_date=end_date)
    daily = run_backtest(market_data, signals, config)
    factor_version = str(factor_values["factor_version"].iloc[0])
    metadata = {
        "strategy_name": strategy.name,
        "engine_version": config.engine_version,
        "start_date": config.start_date,
        "end_date": config.end_date,
        "factor_versions": {strategy.required_factor_name: factor_version},
        "transaction_cost_bps": config.transaction_cost_bps,
        "slippage_bps": config.slippage_bps,
        "initial_equity": config.initial_equity,
        "metrics": calculate_metrics(daily, config.trading_days_per_year),
        "benchmarks": {
            "spy": calculate_metrics(build_spy_benchmark(market_data), config.trading_days_per_year),
            "equal_weight_buy_and_hold": calculate_metrics(
                build_equal_weight_benchmark(market_data), config.trading_days_per_year
            ),
        },
    }
    return save_backtest_result(daily, metadata, root=backtests_root)


def run_baseline_backtests(market_data: pd.DataFrame, factors_root: Path = FACTORS_DIR, backtests_root: Path = BACKTESTS_DIR) -> dict[str, Path]:
    valid_market = market_data.copy()
    if "is_valid" in valid_market.columns:
        valid_market = valid_market[valid_market["is_valid"]].copy()
    else:
        valid_market = valid_market.dropna(subset=["return_1d"]).copy()
    strategies = (MomentumLongOnlyStrategy(), RSIMeanReversionStrategy())
    return {
        strategy.name: _run_one(valid_market, strategy, factors_root, backtests_root)
        for strategy in strategies
    }