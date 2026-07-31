from __future__ import annotations

import pandas as pd
from pathlib import Path

from backend.app.core.config import settings
from ml.training.storage import load_champion_id, load_model_manifest, load_model_artifact, MODELS_DIR
from ml.features.build_dataset import build_feature_dataset
from ml.features.labels import build_forward_return_labels
from ml.strategies.ml_ranker import MLTopKRankStrategy
from ml.backtesting.engine import run_backtest
from ml.backtesting.base import BacktestConfig
from ml.backtesting.storage import save_backtest_result, BACKTESTS_DIR
from ml.backtesting.metrics import calculate_metrics, build_spy_benchmark, build_equal_weight_benchmark

def main() -> None:
    # 1. Load champion model
    try:
        champion_id = load_champion_id()
    except FileNotFoundError:
        print("No champion model found. Skipping ML inference.")
        return
        
    print(f"Loading champion model {champion_id}...")
    manifest = load_model_manifest(champion_id)
    model = load_model_artifact(champion_id, manifest)
    feature_columns = manifest["feature_columns"]
    
    # 2. Load latest market data and prepare dataset
    market = pd.read_parquet(settings.processed_file)
    labels = build_forward_return_labels(market, horizon_days=5)
    dataset, factor_versions = build_feature_dataset(labels, factors_root=Path(settings.factors_dir))
    
    # Drop rows where features are missing
    dataset = dataset.dropna(subset=feature_columns).copy()
    
    # 3. Generate predictions
    print("Running inference...")
    X = dataset[feature_columns]
    preds = model.predict(X)
        
    predictions = dataset[["date", "symbol", "forward_return_5d"]].copy()
    predictions["prediction"] = preds
    predictions["model_id"] = champion_id
    predictions["split"] = "test"
    
    # 4. Save/overwrite test_predictions.parquet for the champion model
    model_dir = MODELS_DIR / f"model_id={champion_id}"
    predictions.to_parquet(model_dir / "test_predictions.parquet", index=False)
    
    # 5. Run ML Backtest
    print("Running ML backtest on updated predictions...")
    signals = MLTopKRankStrategy(top_k=5).generate_signals(predictions)
    active_dates = pd.to_datetime(signals["date"]).unique()
    backtest_market = market[market["date"].isin(active_dates)].copy()
    
    if "is_valid" in backtest_market.columns:
        backtest_market = backtest_market[backtest_market["is_valid"]].copy()
    else:
        backtest_market = backtest_market.dropna(subset=["return_1d"]).copy()
    
    config = BacktestConfig(
        strategy_name="ml_top_5_rank_v1",
        start_date=pd.Timestamp(min(active_dates)).strftime("%Y-%m-%d"),
        end_date=pd.Timestamp(max(active_dates)).strftime("%Y-%m-%d"),
    )
    daily = run_backtest(backtest_market, signals, config)
    
    # 6. Save backtest
    backtest_metadata = {
        "strategy_name": config.strategy_name,
        "engine_version": config.engine_version,
        "start_date": config.start_date,
        "end_date": config.end_date,
        "factor_versions": factor_versions,
        "transaction_cost_bps": config.transaction_cost_bps,
        "slippage_bps": config.slippage_bps,
        "initial_equity": config.initial_equity,
        "metrics": calculate_metrics(daily, config.trading_days_per_year),
        "benchmarks": {
            "spy": calculate_metrics(build_spy_benchmark(backtest_market), config.trading_days_per_year),
            "equal_weight_buy_and_hold": calculate_metrics(build_equal_weight_benchmark(backtest_market), config.trading_days_per_year)
        },
        "champion_model_id": champion_id,
        "selection": "daily updated inference"
    }
    
    backtest_path = save_backtest_result(daily, backtest_metadata, root=BACKTESTS_DIR)
    print(f"Updated predictions for model {champion_id}")
    print(f"Updated ML backtest: {backtest_path.name}")

if __name__ == "__main__":
    main()
