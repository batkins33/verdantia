from pydantic import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "Verdantia API"
    ENV: str = "development"
    DATABASE_URL: str = "sqlite:///./verdantia.db"
    WEATHER_API_KEY: str | None = None
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
