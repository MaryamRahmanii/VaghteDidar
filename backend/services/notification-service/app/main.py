from fastapi import FastAPI

from app.api.routes.admin_router import router as admin_router
from app.api.routes.notification_router import router as notification_router


app = FastAPI()

app.include_router(admin_router)
app.include_router(notification_router)


@app.get("/health")
async def health():
    return {"status": "healthy"}
