from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.routes_backtests import router as backtests_router
from backend.app.api.routes_factors import router as factors_router
from backend.app.api.routes_market_data import router as market_data_router
from backend.app.api.routes_models import router as models_router

app = FastAPI(title="QuantScope API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://quantscope-frontend-dev-942852434802-aps1.s3-website-ap-southeast-1.amazonaws.com",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market_data_router, prefix="/api/v1")
app.include_router(factors_router, prefix="/api/v1")
app.include_router(backtests_router, prefix="/api/v1")
app.include_router(models_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok", "service": "quantscope-api"}