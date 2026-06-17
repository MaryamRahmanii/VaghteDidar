import random
from app.database.redis import redis_client
from app.core.config import settings
import httpx


def _generate_otp() -> str:
    return str(random.randint(100000, 999999))


async def request_otp(phone_number: str):
    rate_key = f"iam:rate:{phone_number}"
    count = await redis_client.get(rate_key)

    if count and int(count) >= settings.OTP_RATE_LIMIT:
        # raise HTTPException(status_code=429, detail="Too many OTP requests. Try again later.")
        raise Exception()

    otp = _generate_otp()

    await redis_client.set(f"iam:otp:{phone_number}", otp, ex=settings.OTP_TTL)

    pipe = redis_client.pipeline()
    await pipe.incr(rate_key)
    await pipe.expire(rate_key, 60)
    await pipe.execute()

    async with httpx.AsyncClient() as client:
        await client.post(
            f"{settings.NOTIFICATION_SERVICE_URL}/notifications/send",
            json={
                "recipient_phone": phone_number,
                "type": "otp",
                "message_body": f"Your VaghteDidar code is: {otp}"
            },
            headers={"X-Internal-Key": settings.INTERNAL_SERVICE_KEY}
        )


async def verify_otp(phone_number: str, otp_code: str) -> str:
    stored = await redis_client.get(f"iam:otp:{phone_number}")

    if not stored or stored != otp_code:
        # raise HTTPException(status_code=401, detail="Invalid or expired OTP.")
        raise Exception()

    await redis_client.delete(f"iam:otp:{phone_number}")

    return phone_number