from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models.bookings import Event, EventCustomField


async def create_event(db: AsyncSession, organizer_id: str, data: dict) -> Event:
    event = Event(organizer_id=organizer_id, **data)
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event


async def add_custom_fields(db: AsyncSession, event_id: UUID, fields: list[dict]):
    for field in fields:
        db.add(EventCustomField(event_id=event_id, **field))
    await db.commit()


async def get_event(db: AsyncSession, event_id: UUID) -> Event | None:
    result = await db.execute(
        select(Event).where(Event.id == event_id)
    )
    return result.scalar_one_or_none()


async def get_active_events(db: AsyncSession) -> list[Event]:
    result = await db.execute(
        select(Event).where(Event.is_active == True)
    )
    return result.scalars().all()


async def get_all_events(db: AsyncSession) -> list[Event]:
    result = await db.execute(select(Event))
    return result.scalars().all()


async def get_organizer_events(db: AsyncSession, organizer_id: str) -> list[Event]:
    result = await db.execute(
        select(Event).where(Event.organizer_id == organizer_id)
    )
    return result.scalars().all()


async def update_event(db: AsyncSession, event: Event, **kwargs) -> Event:
    for key, value in kwargs.items():
        setattr(event, key, value)
    await db.commit()
    await db.refresh(event)
    return event
