from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class OrganizerProfileUpsertSchema(BaseModel):
    name: str
    specialty: Optional[str] = None
    avatar_url: Optional[str] = None


class OrganizerProfileResponseSchema(BaseModel):
    organizer_id: UUID
    name: str
    specialty: Optional[str] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class SlotAvailabilityResponseSchema(BaseModel):
    id: UUID
    time: str          # "YYYY-MM-DD HH:MM" — human-readable for the frontend calendar
    is_available: bool

    class Config:
        from_attributes = True
