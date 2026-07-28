from fastapi.testclient import TestClient

from backend.app.core.config import settings
from backend.app.main import app


def test_missing_model_returns_404(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "models_dir", str(tmp_path))
    response = TestClient(app).get("/api/v1/models/missing")
    assert response.status_code == 404