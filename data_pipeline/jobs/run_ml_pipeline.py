from __future__ import annotations

from pathlib import Path

import pandas as pd

from backend.app.core.config import settings
from data_pipeline.storage.local_store import BACKTESTS_DIR, FACTORS_DIR
from ml.backtesting.base import BacktestConfig
from ml.backtesting.engine import run_backtest
from ml.backtesting.metrics import build_equal_weight_benchmark, build_spy_benchmark, calculate_metrics
from ml.backtesting.storage import save_backtest_result
from ml.features.build_dataset import FEATURE_COLUMNS, build_feature_dataset
from ml.features.labels import build_forward_return_labels
from ml.strategies.ml_ranker import MLTopKRankStrategy
from ml.training.evaluate import select_champion
from ml.training.split import split_dataset
from ml.training.storage import MODELS_DIR, save_model_artifact, save_champion_id
from ml.training.train import train_baseline_models

def _split_dates(split: object) -> dict[str, str]:
    return {
        "train_start": min(split.train_dates).strftime("%Y-%m-%d"),
        "train_end": max(split.train_dates).strftime("%Y-%m-%d"),
        "validation_start": min(split.validation_dates).strftime("%Y-%m-%d"),
        "validation_end": max(split.validation_dates).strftime("%Y-%m-%d"),
        "test_start": min(split.test_dates).strftime("%Y-%m-%d"),
        "test_end": max(split.test_dates).strftime("%Y-%m-%d"),
    }

def run_ml_pipeline(market_data: pd.DataFrame, factors_root: Path = FACTORS_DIR, 
                    models_root: Path = MODELS_DIR, backtests_root: Path = BACKTESTS_DIR) -> dict[str, object]:
    labels = build_forward_return_labels(market_data, horizon_days=5)
    dataset, factor_versions = build_feature_dataset(labels, factors_root=factors_root)
    split = split_dataset(dataset, embargo_days=5)
    trained_models = train_baseline_models(split, FEATURE_COLUMNS)
    model_paths: dict[str, Path] = {}
    model_ids: dict[str, str] = {}
    for family, trained in trained_models.items():
        manifest = {
            "family": family,
            "feature_columns": list(FEATURE_COLUMNS),
            "factor_versions": factor_versions,
            "label": {"name": "forward_return_5d", "horizon_days": 5},
            "split_dates": _split_dates(split),
            "parameters": trained.parameters,
            "metrics": {
                "validation": trained.validation_metrics,
                "test": trained.test_metrics
            }
        }
        path = save_model_artifact(trained, manifest, root=models_root)
        model_paths[family] = path
        model_ids[family] = path.name.removeprefix("model_id=")
        
    champion = select_champion({family: item.validation_metrics for family, item in trained_models.items()})
    champion_predictions = trained_models[champion].test_predictions.copy()
    signals = MLTopKRankStrategy(top_k=5).generate_signals(champion_predictions)
    active_dates = pd.to_datetime(signals["date"]).unique()
    backtest_market = market_data[market_data["date"].isin(active_dates)].copy()
    config = BacktestConfig(
        strategy_name="ml_top_5_rank_v1",
        start_date=pd.Timestamp(min(active_dates)).strftime("%Y-%m-%d"),
        end_date=pd.Timestamp(max(active_dates)).strftime("%Y-%m-%d"),
    )
    
    daily = run_backtest(backtest_market, signals, config)
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
        "champion_model_id": model_ids[champion],
        "selection": "lowest validation RMSE; rank IC only breaks an exact RMSE tie"
    }
    
    backtest_path = save_backtest_result(daily, backtest_metadata, root=backtests_root)
    save_champion_id(model_ids[champion], root=models_root)
    return {"models": model_paths, "champion": model_ids[champion], "backtest": backtest_path}

def main() -> None:
    market = pd.read_parquet(settings.processed_file)
    outputs = run_ml_pipeline(market, Path(settings.factors_dir))
    print(f"champion={outputs["champion"]}")
    print(f"backtest={outputs["backtest"]}")
    
if __name__ == "__main__":
    main()