from pathlib import Path

from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.core.config import settings
from ml.factors.momentum import MomentumFactor
from ml.factors.storage import build_factor_frame, save_factor_values

def _seed_factor_storage(ohlcv_frame, root: Path) -> None:
    frame = build_factor_frame(MomentumFactor(20), ohlcv_frame)
    save_factor_values(frame, "momentum_20d", root=root)
    
def test_list_factors_returns_default_metadata():
    response = TestClient(app).get("/api/v1/factors")
    assert response.status_code == 200
    assert response.json()["count"] == 6
    assert {item["name"] for item in response.json()["factors"]} >= {"momentum_20d", "rsi_14"}
    
def test_get_factor_values_filters_symbol_and_limit(ohlcv_frame, tmp_path, monkeypatch):
    _seed_factor_storage(ohlcv_frame, tmp_path)
    monkeypatch.setattr(settings, "factors_dir", str(tmp_path))
    
    response = TestClient(app).get("/api/v1/factors/momentum_20d?symbol=AAA&limit=3")
    
    body = response.json()
    assert response.status_code == 200
    assert body["factor_name"] == "momentum_20d"
    assert body["count"] == 3
    assert {row["symbol"] for row in body["data"]} == {"AAA"}
    
def test_missing_stored_factor_returns_404(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "factors_dir", str(tmp_path))
    response = TestClient(app).get("/api/v1/factors/rsi_14")
    assert response.status_code == 404
    
def test_invalid_date_range_returns_422(ohlcv_frame, tmp_path, monkeypatch):
    _seed_factor_storage(ohlcv_frame, tmp_path)
    monkeypatch.setattr(settings, "factors_dir", str(tmp_path))
    
    response = TestClient(app).get("/api/v1/factors/momentum_20d?start_date=2024-05-01&end_date=2024-01-01")
    assert response.status_code == 422