from fastapi import FastAPI

from app.api.routes.admin_router import router as admin_router
from app.api.routes.booking_router import router as booking_router
from app.api.routes.event_router import router as event_router
from app.api.routes.organizer_router import router as organizer_router


app = FastAPI()

app.include_router(admin_router)
app.include_router(booking_router)
app.include_router(event_router)
app.include_router(organizer_router)


@app.get("/health")
async def health():
    return {"status": "healthy"}
