from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.domain.notification_status import NotificationStatus
from app.domain.notification_type import NotificationType


class NotificationSendSchema(BaseModel):
    recipient_phone: str
    recipient_user_id: Optional[UUID] = None
    type: NotificationType
    message_body: str
    related_booking_id: Optional[UUID] = None


class BulkNotificationSchema(BaseModel):
    event_id: UUID
    message_body: str


class NotificationResponseSchema(BaseModel):
    id: UUID
    recipient_phone: str
    type: NotificationType
    status: NotificationStatus
    sent_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
