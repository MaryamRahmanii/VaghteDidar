from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class EventCreateSchema(BaseModel):
    title: str
    description: Optional[str]
    session_duration_minutes: int


class CustomFieldSchema(BaseModel):
    field_label: str
    field_type: str = "text"
    is_required: bool = True
    display_order: int = 0


class EventWithFieldsCreateSchema(BaseModel):
    event: EventCreateSchema
    custom_fields: List[CustomFieldSchema] = []


class EventResponseSchema(BaseModel):
    id: UUID
    organizer_id: UUID
    title: str
    description: Optional[str]
    session_duration_minutes: int
    is_active: bool
    custom_fields: List[CustomFieldSchema]
    created_at: datetime

    class Config:
        from_attributes = True
