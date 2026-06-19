from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.database.database import engine, Base

from app.api.routes.admin_router import router as admin_router
from app.api.routes.notification_router import router as notification_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(admin_router)
app.include_router(notification_router)


@app.get("/health")
async def health():
    return {"status": "healthy"}
