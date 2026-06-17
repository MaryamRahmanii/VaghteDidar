from pydantic import BaseModel
from typing import Optional
from datetime import datetime
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