import json
from fastapi import Header, HTTPException

from app.database.redis import redis_client


async def get_current_user(authorization: str = Header(...)) -> dict:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid authorization header.")

    data = await redis_client.get(f"iam:session:{token}")
    if not data:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")

    return json.loads(data)


async def require_organizer(user: dict = None) -> dict:
    from fastapi import Depends
    user = user or {}
    if user.get("role") not in ("organizer", "admin"):
        raise HTTPException(status_code=403, detail="Organizer access required.")
    return user


async def require_admin(user: dict = None) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")
    return user
