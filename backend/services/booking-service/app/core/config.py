from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@postgres/iam_db"
    REDIS_URL: str = "redis://:redis@redis:6379"
    NOTIFICATION_SERVICE_URL: str = "http://localhost:8002"
    INTERNAL_SERVICE_KEY: str = "a3f8c2e1b7d4e9f0c6a2b8d3e7f1c4a9b2d6e0f3c8a1b5d9e2f7c0a4b8d1e6"
    MAX_ACTIVE_BOOKINGS: int = 3

    class Config:
        env_file = ".env"

settings = Settings()
