from data_pipeline.jobs.run_backtests import run_baseline_backtests


def test_batch_runner_persists_two_strategy_artifacts(ohlcv_frame, tmp_path):
    # Build factors in a temporary root with the existing Week 3 registry.
    from ml.factors.registry import build_default_registry
    from ml.factors.storage import save_factor_values

    market = ohlcv_frame.replace({"symbol": {"BBB": "SPY"}})
    factors_root = tmp_path / "factors"
    for name, frame in build_default_registry().compute_all(market).items():
        save_factor_values(frame, name, root=factors_root)

    outputs = run_baseline_backtests(
        market_data=market,
        factors_root=factors_root,
        backtests_root=tmp_path / "backtests",
    )

    assert set(outputs) == {"momentum_long_only_v1", "rsi_mean_reversion_v1"}
    assert all(path.exists() for path in outputs.values())