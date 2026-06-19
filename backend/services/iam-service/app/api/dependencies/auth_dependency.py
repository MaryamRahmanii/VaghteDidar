from fastapi import Depends, Security, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.domain.models.users import User

from app.services.session_service import get_session
from app.infrastructure.repositories.user_repository import get_user_by_id
from app.database.database import get_db

bearer_scheme = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
    db=Depends(get_db)
) -> User:
    token = credentials.credentials
    session = await get_session(token)
    return await get_user_by_id(db, session.get("user_id"))



async def require_admin(user=Depends(get_current_user)) -> User:
    if not user["role"] or user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")
    return user


async def require_organizer(user=Depends(get_current_user)) -> User:
    if not user["user"] or user["role"] not in ("organizer", "admin"):
        raise HTTPException(status_code=403, detail="Organizer access required.")
    return user