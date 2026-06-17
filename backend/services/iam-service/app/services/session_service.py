import uuid, json
from app.database.redis import redis_client
from app.core.config import settings


async def create_session(user_id: str, role: str) -> str:
    token = str(uuid.uuid4())
    payload = json.dumps({"user_id": user_id, "role": role})
    await redis_client.set(f"iam:session:{token}", payload, ex=settings.SESSION_TTL)
    return token


async def get_session(token: str) -> dict:
    data = await redis_client.get(f"iam:session:{token}")
    if not data:
        # raise HTTPException(status_code=401, detail="Invalid or expired session.")
        raise Exception()
    return json.loads(data)


async def delete_session(token: str):
    await redis_client.delete(f"iam:session:{token}")