from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "QuantScope API"
    processed_file: str = "data/processed/ohlcv_20200101_20260731.parquet"
    factors_dir: str = "data/factors"
    backtests_dir: str = "data/artifacts/backtests"
    models_dir: str = "data/artifacts/models"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()