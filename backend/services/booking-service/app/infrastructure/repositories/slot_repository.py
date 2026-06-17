from uuid import UUID
from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models.bookings import TimeSlot, SessionStatus


async def bulk_create_slots(
    db: AsyncSession,
    event_id: UUID,
    windows: list[dict],
    duration_minutes: int
) -> list[TimeSlot]:
    slots = []

    for window in windows:
        date = window["date"]
        from_time = window["from_time"]
        to_time = window["to_time"]

        # Parse start and end of the window
        start = datetime.fromisoformat(f"{date}T{from_time}:00")
        end = datetime.fromisoformat(f"{date}T{to_time}:00")
        delta = timedelta(minutes=duration_minutes)

        # Explode window into individual slots
        current = start
        while current + delta <= end:
            slot = TimeSlot(
                event_id=event_id,
                start_time=current,
                end_time=current + delta,
                status=SessionStatus.available
            )
            db.add(slot)
            slots.append(slot)
            current += delta

    await db.commit()
    for slot in slots:
        await db.refresh(slot)

    return slots


async def get_slot(db: AsyncSession, slot_id: UUID) -> TimeSlot | None:
    result = await db.execute(
        select(TimeSlot).where(TimeSlot.id == slot_id)
    )
    return result.scalar_one_or_none()


async def get_available_slots(db: AsyncSession, event_id: UUID) -> list[TimeSlot]:
    result = await db.execute(
        select(TimeSlot)
        .where(TimeSlot.event_id == event_id)
        .where(TimeSlot.status == SessionStatus.available)
        .order_by(TimeSlot.start_time)
    )
    return result.scalars().all()


async def update_slot_status(
    db: AsyncSession,
    slot: TimeSlot,
    status: SessionStatus
) -> TimeSlot:
    slot.status = status
    await db.commit()
    await db.refresh(slot)
    return slot
