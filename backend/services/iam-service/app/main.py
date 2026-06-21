from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.database.database import engine, Base

from app.api.routes.admin_router import router as admin_router
from app.api.routes.auth_router import router as auth_router
from app.api.routes.profile_router import router as profile_router

from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)


app.include_router(admin_router)
app.include_router(auth_router)
app.include_router(profile_router)


@app.get("/health")
async def health():
    return {"status": "healthy"}
