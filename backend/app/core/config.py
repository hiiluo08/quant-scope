from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "QuantScope API"
    processed_file: str = "data/processed/ohlcv_20220101_20241231.parquet"
    
    class Config:
        env_file = ".env"

settings = Settings()