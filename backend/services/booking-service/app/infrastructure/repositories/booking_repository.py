from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models.bookings import Booking, BookingStatus, TimeSlot


async def create_booking(
    db: AsyncSession,
    time_slot_id: UUID,
    registrant_id: str,
    custom_field_data: dict
) -> Booking:
    booking = Booking(
        time_slot_id=time_slot_id,
        registrant_id=registrant_id,
        custom_field_data=custom_field_data
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking


async def get_booking(db: AsyncSession, booking_id: UUID) -> Booking | None:
    result = await db.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    return result.scalar_one_or_none()


async def get_user_bookings(db: AsyncSession, registrant_id: str) -> list[Booking]:
    result = await db.execute(
        select(Booking)
        .where(Booking.registrant_id == registrant_id)
        .order_by(Booking.created_at.desc())
    )
    return result.scalars().all()


async def get_event_bookings(db: AsyncSession, event_id: UUID) -> list[Booking]:
    result = await db.execute(
        select(Booking)
        .join(TimeSlot, Booking.time_slot_id == TimeSlot.id)
        .where(TimeSlot.event_id == event_id)
        .where(Booking.status == BookingStatus.active)
    )
    return result.scalars().all()


async def cancel_booking(
    db: AsyncSession,
    booking: Booking,
    cancelled_by: str
) -> Booking:
    booking.status = BookingStatus.cancelled
    booking.cancelled_by = cancelled_by
    booking.cancelled_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(booking)
    return booking


async def get_all_bookings(db: AsyncSession) -> list[Booking]:
    result = await db.execute(
        select(Booking).order_by(Booking.created_at.desc())
    )
    return result.scalars().all()
