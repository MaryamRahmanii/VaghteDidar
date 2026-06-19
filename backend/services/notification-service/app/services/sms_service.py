import httpx

from app.core.config import settings


async def send_sms(recipient_phone: str, message_body: str):
    url = "https://api.kavenegar.com/v1/{api_key}/sms/send.json".format(
        api_key=settings.SMS_API_KEY
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, data={
                "receptor": recipient_phone,
                "message": message_body,
                "sender": settings.SMS_SENDER,
            })
    except httpx.RequestError as e:
        raise Exception(f"Failed to reach SMS provider: {repr(e)}") from e

    if response.status_code != 200:
        raise Exception(f"SMS provider error: {response.status_code} — {response.text}")

    try:
        body = response.json()
    except ValueError as e:
        raise Exception(f"SMS provider returned invalid JSON: {response.text}") from e

    return_code = body.get("return", {}).get("status")
    if return_code != 200:
        raise Exception(f"SMS provider rejected: {body.get('return', {}).get('message')}")
