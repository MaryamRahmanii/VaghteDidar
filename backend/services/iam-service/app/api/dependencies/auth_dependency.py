from fastapi import Depends, Header
from app.services.session_service import get_session


async def get_current_user(authorization: str = Header(...)) -> dict:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        # raise HTTPException(status_code=401, detail="Invalid authorization header.")
        raise Exception()
    return await get_session(token)


async def require_admin(user=Depends(get_current_user)):
    if user["role"] != "admin":
        # raise HTTPException(status_code=403, detail="Admin access required.")
        raise Exception()
    return user


async def require_organizer(user=Depends(get_current_user)):
    if user["role"] not in ("organizer", "admin"):
        # raise HTTPException(status_code=403, detail="Organizer access required.")
        raise Exception()
    return user