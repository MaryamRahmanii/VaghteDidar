from fastapi import APIRouter, Depends
from uuid import UUID

from app.database.database import get_db
from app.api.dependencies.api_dependency import get_current_user

from app.domain.schemas.bookings import (
    BookingCreateSchema, BookingCancelSchema, BookingResponseSchema
)

from app.services.booking_service import create_booking, cancel_booking
from app.infrastructure.repositories.booking_repository import get_user_bookings


router = APIRouter(tags=["bookings"])


@router.post("/bookings", response_model=BookingResponseSchema, status_code=201)
async def book_slot(
    body: BookingCreateSchema,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    return await create_booking(db, body.time_slot_id, user, body.custom_field_data)


@router.get("/bookings/me", response_model=list[BookingResponseSchema])
async def my_bookings(db=Depends(get_db), user=Depends(get_current_user)):
    return await get_user_bookings(db, user["user_id"])


@router.delete("/bookings/{booking_id}", response_model=BookingResponseSchema)
async def cancel_my_booking(
    booking_id: UUID,
    body: BookingCancelSchema,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    return await cancel_booking(db, booking_id, "registrant", user)
