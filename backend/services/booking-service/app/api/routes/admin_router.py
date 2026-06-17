from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select

from app.database.database import get_db
from app.api.dependencies.api_dependency import get_current_user

from app.domain.schemas.bookings import BookingResponseSchema
from app.domain.schemas.events import EventResponseSchema
from app.domain.models.bookings import Event, Booking, BookingStatus

from app.infrastructure.repositories.event_repository import get_all_events
from app.infrastructure.repositories.booking_repository import get_all_bookings


router = APIRouter(prefix="/admin", tags=["admin"])


def _require_admin(user: dict):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")


@router.get("/events", response_model=list[EventResponseSchema])
async def list_all_events(db=Depends(get_db), user=Depends(get_current_user)):
    _require_admin(user)
    return await get_all_events(db)


@router.get("/bookings", response_model=list[BookingResponseSchema])
async def list_all_bookings(db=Depends(get_db), user=Depends(get_current_user)):
    _require_admin(user)
    return await get_all_bookings(db)


@router.get("/stats")
async def system_stats(db=Depends(get_db), user=Depends(get_current_user)):
    _require_admin(user)

    total_events = await db.scalar(select(func.count()).select_from(Event))
    total_bookings = await db.scalar(select(func.count()).select_from(Booking))
    active_bookings = await db.scalar(
        select(func.count()).select_from(Booking)
        .where(Booking.status == BookingStatus.active)
    )

    return {
        "total_events": total_events,
        "total_bookings": total_bookings,
        "active_bookings": active_bookings,
    }
