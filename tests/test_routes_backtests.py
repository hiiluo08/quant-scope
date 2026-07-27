from fastapi.testclient import TestClient

from backend.app.core.config import settings
from backend.app.main import app
from ml.backtesting.storage import save_backtest_result


def test_list_and_read_stored_backtest(daily_results, tmp_path, monkeypatch):
    path = save_backtest_result(
        daily_results,
        {
            "strategy_name": "momentum_long_only_v1",
            "engine_version": "v1",
            "start_date": "2024-01-02",
            "end_date": "2024-01-03",
            "factor_versions": {"momentum_20d": "v1"},
            "transaction_cost_bps": 5.0,
            "slippage_bps": 5.0,
            "initial_equity": 1.0,
            "metrics": {"total_return": 0.009},
            "benchmarks": {"spy": {"total_return": 0.0}},
        },
        root=tmp_path,
    )
    backtest_id = path.name.removeprefix("backtest_id=")
    monkeypatch.setattr(settings, "backtests_dir", str(tmp_path))
    client = TestClient(app)

    listed = client.get("/api/v1/backtests")
    detail = client.get(f"/api/v1/backtests/{backtest_id}")
    daily = client.get(f"/api/v1/backtests/{backtest_id}/daily?limit=1")

    assert listed.status_code == 200 and listed.json()["count"] == 1
    assert detail.status_code == 200 and detail.json()["backtest_id"] == backtest_id
    assert daily.status_code == 200 and daily.json()["count"] == 1


def test_missing_backtest_is_404(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "backtests_dir", str(tmp_path))
    response = TestClient(app).get("/api/v1/backtests/missing")
    assert response.status_code == 404