from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date, time
from uuid import UUID

from app.domain.booking_status import BookingStatus


class BookingCreateSchema(BaseModel):
    time_slot_id: UUID
    custom_field_data: Optional[dict] = {}


class BookingCancelSchema(BaseModel):
    reason: Optional[str] = None


class BookingResponseSchema(BaseModel):
    id: UUID
    time_slot_id: UUID
    registrant_id: UUID
    status: BookingStatus
    custom_field_data: Optional[dict]
    created_at: datetime
    cancelled_at: Optional[datetime]

    class Config:
        from_attributes = True


class BookingDetailResponseSchema(BookingResponseSchema):
    """
    Enriched schema for GET /bookings/me — includes slot and event info
    so the frontend can display the appointment without extra round-trips.
    """
    appointment_date: Optional[date] = None
    appointment_time: Optional[time] = None
    meeting_title: Optional[str] = None
    organizer_name: Optional[str] = None