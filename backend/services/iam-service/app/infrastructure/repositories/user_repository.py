from sqlalchemy import select
from app.domain.models.users import User, UserRole


async def get_user_by_phone(db, phone_number: str) -> User | None:
    result = await db.execute(select(User).where(User.phone_number == phone_number))
    return result.scalar_one_or_none()


async def create_user(db, phone_number: str, role=UserRole.registrant) -> User:
    user = User(phone_number=phone_number, role=role)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def get_or_create_user(db, phone_number: str) -> User:
    user = await get_user_by_phone(db, phone_number)
    if not user:
        user = await create_user(db, phone_number)
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
