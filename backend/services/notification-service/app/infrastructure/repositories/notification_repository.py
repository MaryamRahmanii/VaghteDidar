from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone

from app.domain.models.notifications import Notification, NotificationStatus


async def create_notification(db: AsyncSession, data: dict) -> Notification:
    notification = Notification(**data)
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification


async def get_notification(db: AsyncSession, notification_id: str) -> Notification | None:
    result = await db.execute(
        select(Notification).where(Notification.id == UUID(notification_id))
    )
    return result.scalar_one_or_none()


async def update_status(
    db: AsyncSession,
    notification: Notification,
    status: NotificationStatus,
    error: str | None = None
):
    notification.status = status
    notification.error_detail = error

    if status == NotificationStatus.sent:
        notification.sent_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(notification)
    return notification


async def get_notifications_by_phone(
    db: AsyncSession,
    phone: str
) -> list[Notification]:
    result = await db.execute(
        select(Notification)
        .where(Notification.recipient_phone == phone)
        .order_by(Notification.created_at.desc())
    )
    return result.scalars().all()


async def get_all_notifications(db: AsyncSession) -> list[Notification]:
    result = await db.execute(
        select(Notification).order_by(Notification.created_at.desc())
    )
    return result.scalars().all()


async def get_notification_stats(db: AsyncSession) -> dict:
    from sqlalchemy import func
    result = await db.execute(
        select(Notification.status, func.count().label("count"))
        .group_by(Notification.status)
    )
    rows = result.all()
    stats = {"sent": 0, "failed": 0, "pending": 0}
    for row in rows:
        stats[row.status.value] = row.count
    return stats
