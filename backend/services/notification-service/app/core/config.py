from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@postgres/iam_db"
    REDIS_URL: str = "redis://:redis@redis:6379"
    INTERNAL_SERVICE_KEY: str = "a3f8c2e1b7d4e9f0c6a2b8d3e7f1c4a9b2d6e0f3c8a1b5d9e2f7c0a4b8d1e6"
    SMS_API_KEY: str = ""
    SMS_SENDER: str = "VaghteDidar"

    class Config:
        env_file = ".env"


settings = Settings()
