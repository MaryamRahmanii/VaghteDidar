from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from app.database.database import get_db
from app.domain.schemas.notifications import NotificationResponseSchema
from app.infrastructure.repositories.notification_repository import (
    get_all_notifications, get_notification, get_notification_stats
)

router = APIRouter(prefix="/admin/notifications", tags=["Admin"])


@router.get(
    "/admin/notifications",
    response_model=list[NotificationResponseSchema]
)
async def list_all_notifications(db=Depends(get_db)):
    return await get_all_notifications(db)


@router.get(
    "/{notification_id}",
    response_model=NotificationResponseSchema
)
async def get_single_notification(notification_id: UUID, db=Depends(get_db)):
    notification = await get_notification(db, str(notification_id))
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found.")
    return notification


@router.get("/stats")
async def notification_stats(db=Depends(get_db)):
    return await get_notification_stats(db)
