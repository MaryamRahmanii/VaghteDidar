import httpx

from app.core.config import settings


async def notify(
    recipient_phone: str,
    notification_type: str,
    message_body: str,
    recipient_user_id: str | None = None,
    related_booking_id: str | None = None
):
    async with httpx.AsyncClient() as client:
        await client.post(
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
