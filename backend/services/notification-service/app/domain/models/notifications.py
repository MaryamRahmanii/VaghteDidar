import uuid
from sqlalchemy import Column, String, Text, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.domain.notification_status import NotificationStatus
from app.domain.notification_type import NotificationType
from app.database.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recipient_phone = Column(String(15), nullable=False, index=True)
    recipient_user_id = Column(UUID(as_uuid=True), nullable=True)
    type = Column(
        Enum(NotificationType), nullable=False
    )
    message_body = Column(Text, nullable=False)
    status = Column(
        Enum(NotificationStatus), default=NotificationStatus.pending
    )
    related_booking_id = Column(UUID(as_uuid=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    error_detail = Column(Text, nullable=True)
