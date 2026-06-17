from fastapi import APIRouter, Header, Depends
from typing import List
from sqlalchemy import select

from app.database.database import get_db
from app.database.redis import redis_client

from app.api.dependencies.api_dependency import verify_internal_key

from app.domain.schemas.notifications import (
    NotificationResponseSchema, NotificationSendSchema, 
    BulkNotificationSchema
)
from app.domain.models.notifications import Notification

from app.infrastructure.repositories.notification_repository import (
    create_notification, get_notifications_by_phone
)

DEDUP_TTL = 300

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.post(
    "/notifications/send",
    response_model=NotificationResponseSchema,
    status_code=202,
    dependencies=[Depends(verify_internal_key)]   # internal only
)
async def send_notification(body: NotificationSendSchema, db=Depends(get_db)):
    if body.related_booking_id:
        dedup_key = f"notif:dedup:{body.related_booking_id}:{body.type.value}"
        is_duplicate = await redis_client.set(dedup_key, 1, nx=True, ex=DEDUP_TTL)
        if not is_duplicate:
            # Already queued recently — skip silently
            result = await db.execute(
                select(Notification)
                .where(Notification.related_booking_id == body.related_booking_id)
                .where(Notification.type == body.type)
                .order_by(Notification.created_at.desc())
            )
            return result.scalar_one()

    notification = await create_notification(db, {
        "recipient_phone": body.recipient_phone,
        "recipient_user_id": body.recipient_user_id,
        "type": body.type,
        "message_body": body.message_body,
        "related_booking_id": body.related_booking_id,
    })

    await redis_client.lpush("notif:queue", str(notification.id))

    return notification


@router.post(
    "/notifications/bulk",
    dependencies=[Depends(verify_internal_key)]
)
async def bulk_notification(body: BulkNotificationSchema, db=Depends(get_db)):
    return {"message": "Bulk notifications queued"}


@router.get(
    "/notifications/history",
    response_model=list[NotificationResponseSchema]
)
async def notification_history(phone: str, db=Depends(get_db)):
    return await get_notifications_by_phone(db, phone)
