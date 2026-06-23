import httpx
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


async def notify(
    recipient_phone: str,
    notification_type: str,
    message_body: str,
    recipient_user_id: str | None = None,
    related_booking_id: str | None = None
):
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                f"{settings.NOTIFICATION_SERVICE_URL}/notifications/send",
                json={
                    "recipient_phone": recipient_phone,
                    "recipient_user_id": recipient_user_id,
                    "type": notification_type,
                    "message_body": message_body,
                    "related_booking_id": related_booking_id,
                },
                headers={"x-internal-key": settings.INTERNAL_SERVICE_KEY}
            )
            response.raise_for_status()
    except httpx.HTTPError as e:
        logger.error(
            "Failed to deliver notification type=%s to user=%s: %s",
            notification_type, recipient_user_id, repr(e)
        )