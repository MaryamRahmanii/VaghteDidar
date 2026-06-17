import httpx

from app.core.config import settings


async def send_sms(recipient_phone: str, message_body: str):
    """
    Sends SMS via Kavenegar API.
    Raises an exception if the call fails — worker will catch it and mark as failed.
    """
    url = "https://api.kavenegar.com/v1/{api_key}/sms/send.json".format(
        api_key=settings.SMS_API_KEY
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data={
            "receptor": recipient_phone,
            "message": message_body,
            "sender": settings.SMS_SENDER,
        })

    if response.status_code != 200:
        raise Exception(f"SMS provider error: {response.status_code} — {response.text}")

    body = response.json()

    return_code = body.get("return", {}).get("status")
    if return_code != 200:
        raise Exception(f"SMS provider rejected: {body.get('return', {}).get('message')}")