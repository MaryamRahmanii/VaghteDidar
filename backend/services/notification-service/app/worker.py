import asyncio
import logging

from app.database.redis import redis_client
from app.database.database import AsyncSessionLocal
from app.infrastructure.repositories.notification_repository import (
    get_notification,
    update_status
)
from app.services.sms_service import send_sms
from app.domain.models.notifications import NotificationStatus

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("notification-worker")


async def process_notification(notification_id: str):
    async with AsyncSessionLocal() as db:
        notification = await get_notification(db, notification_id)

        if not notification:
            logger.warning(f"Notification {notification_id} not found — skipping.")
            return

        if notification.status != NotificationStatus.pending:
            logger.info(f"Notification {notification_id} already processed — skipping.")
            return

        try:
            await send_sms(notification.recipient_phone, notification.message_body)
            await update_status(db, notification, NotificationStatus.sent)
            logger.info(f"Notification {notification_id} sent successfully.")

        except Exception as e:
            await update_status(db, notification, NotificationStatus.failed, error=str(e))
            logger.error(f"Notification {notification_id} failed: {e}")


async def run():
    logger.info("Notification worker started — waiting for jobs...")

    while True:
        try:
            result = await redis_client.brpop("notif:queue", timeout=0)

            if result:
                _, notification_id = result
                logger.info(f"Picked up notification: {notification_id}")
                await process_notification(notification_id)

        except Exception as e:
            logger.error(f"Worker loop error: {e}")
            await asyncio.sleep(2)


if __name__ == "__main__":
    asyncio.run(run())
