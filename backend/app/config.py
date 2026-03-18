from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    RAWG_API_KEY: str
    DATABASE_URL: str = "sqlite:///./questlog.db"
    RAWG_BASE_URL: str = "https://api.rawg.io/api"

    class Config:
        env_file = ".env"


settings = Settings()