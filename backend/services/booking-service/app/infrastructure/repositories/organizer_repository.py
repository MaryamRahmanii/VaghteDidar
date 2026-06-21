from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models.bookings import OrganizerProfile


async def get_organizer_profile(
    db: AsyncSession, organizer_id: UUID
) -> OrganizerProfile | None:
    result = await db.execute(
        select(OrganizerProfile).where(OrganizerProfile.organizer_id == organizer_id)
    )
    return result.scalar_one_or_none()


async def upsert_organizer_profile(
    db: AsyncSession,
    organizer_id: UUID,
    name: str,
    specialty: str | None,
    avatar_url: str | None,
) -> OrganizerProfile:
    profile = await get_organizer_profile(db, organizer_id)
    if profile:
        profile.name = name
        profile.specialty = specialty
        profile.avatar_url = avatar_url
    else:
        profile = OrganizerProfile(
            organizer_id=organizer_id,
            name=name,
            specialty=specialty,
            avatar_url=avatar_url,
        )
        db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile
