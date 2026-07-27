import json

from ml.backtesting.storage import (
    build_backtest_id,
    list_backtests,
    load_backtest_result,
    save_backtest_result,
)


def _metadata() -> dict[str, object]:
    return {
        "strategy_name": "momentum_long_only_v1",
        "engine_version": "v1",
        "start_date": "2024-01-02",
        "end_date": "2024-01-08",
        "factor_versions": {"momentum_20d": "v1"},
        "transaction_cost_bps": 5.0,
        "slippage_bps": 5.0,
        "initial_equity": 1.0,
        "metrics": {"total_return": 0.01},
        "benchmarks": {"spy": {"total_return": 0.02}},
    }


def test_backtest_id_is_stable_and_changes_when_cost_changes():
    first = build_backtest_id(_metadata())
    assert first == build_backtest_id(_metadata())
    changed = {**_metadata(), "transaction_cost_bps": 10.0}
    assert first != build_backtest_id(changed)


def test_storage_round_trip_and_list(daily_results, tmp_path):
    path = save_backtest_result(daily_results, _metadata(), root=tmp_path)
    backtest_id = path.name.removeprefix("backtest_id=")
    metadata, loaded_daily = load_backtest_result(backtest_id, root=tmp_path)

    assert metadata["backtest_id"] == backtest_id
    assert loaded_daily.equals(daily_results)
    assert list_backtests(root=tmp_path) == [metadata]
    assert json.loads((path / "metadata.json").read_text())["strategy_name"] == "momentum_long_only_v1"