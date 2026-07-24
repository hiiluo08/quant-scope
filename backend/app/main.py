from fastapi import FastAPI

from backend.app.api.routes_factors import router as factors_router
from backend.app.api.routes_market_data import router as market_data_router

app = FastAPI(title="QuantScope API", version="0.2.0")
app.include_router(market_data_router, prefix="/api/v1")
app.include_router(factors_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok", "service": "quantscope-api"}