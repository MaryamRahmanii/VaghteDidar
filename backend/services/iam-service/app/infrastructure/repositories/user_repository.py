from uuid import UUID
from sqlalchemy import select

from app.domain.models.users import User
from app.domain.user_role import UserRole


async def get_user_by_id(db, user_id: str) -> User | None:
    result = await db.execute(select(User).where(User.user_id == UUID(user_id)))
    return result.scalar_one_or_none()


async def get_user_by_phone(db, phone_number: str) -> User | None:
    result = await db.execute(select(User).where(User.phone_number == phone_number))
    return result.scalar_one_or_none()


async def create_user(
    db,
    phone_number: str,
    full_name: str,
    role=UserRole.registrant
) -> User:
    user = User(phone_number=phone_number, full_name=full_name, role=role)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def get_user(db, phone_number: str) -> User:
    user = await get_user_by_phone(db, phone_number)
    return user


async def get_all_users(db) -> list[User]:
    result = await db.execute(select(User))
    return result.scalars().all()


async def update_user(db, user: User, **kwargs) -> User:
    for key, value in kwargs.items():
        setattr(user, key, value)
    await db.commit()
    await db.refresh(user)
    return user
