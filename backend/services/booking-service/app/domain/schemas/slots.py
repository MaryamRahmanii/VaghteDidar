from pydantic import BaseModel
from datetime import datetime
from typing import List
from uuid import UUID

from app.domain.session_status import SessionStatus


class TimeSlotBulkCreateSchema(BaseModel):
    event_id: UUID
    available_windows: List[dict]


class TimeSlotResponseSchema(BaseModel):
    id: UUID
    event_id: UUID
    start_time: datetime
    end_time: datetime
    status: SessionStatus
