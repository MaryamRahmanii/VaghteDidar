from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.database.database import get_db
from app.domain.schemas.users import UserCreateSchema, UserSchema
from app.domain.models.users import User

from app.api.dependencies.auth_dependency import require_admin
from app.infrastructure.repositories import user_repository


router = APIRouter(
    prefix="/admin", 
    tags=["Admin"], 
    dependencies=[Depends(require_admin)]
)

@router.get("/users", response_model=List[UserSchema])
async def list_users(db=Depends(get_db), _=Depends(require_admin)):
    return await user_repository.get_all_users(db)


@router.get("/users/{user_id}", response_model=UserSchema)
async def get_user(user_id: str, db=Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404)
    return user


@router.patch("/users/{user_id}", response_model=UserSchema)
async def update_user(user_id: str, body: UserCreateSchema, db=Depends(get_db)):
    user = await db.get(User, user_id)
    return await user_repository.update_user(db, user, **body.model_dump(exclude_unset=True))


@router.delete("/users/{user_id}")
async def deactivate_user(user_id: str, db=Depends(get_db)):
    user = await db.get(User, user_id)
    await user_repository.update_user(db, user, is_active=False)
    return {"message": "deactivated"}
