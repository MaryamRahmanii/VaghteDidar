from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models.bookings import (
    Booking, TimeSlot, Event, OrganizerProfile
)
from app.domain.booking_status import BookingStatus


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


async def get_user_bookings_detailed(db: AsyncSession, registrant_id: str) -> list[dict]:
    result = await db.execute(
        select(Booking, TimeSlot, Event, OrganizerProfile)
        .join(TimeSlot, Booking.time_slot_id == TimeSlot.id)
        .join(Event, TimeSlot.event_id == Event.id)
        .outerjoin(
            OrganizerProfile,
            OrganizerProfile.organizer_id == Event.organizer_id
        )
        .where(Booking.registrant_id == registrant_id)
        .order_by(Booking.created_at.desc())
    )
    rows = result.all()

    bookings = []
    for booking, slot, event, organizer in rows:
        bookings.append({
            # base booking fields
            "id": booking.id,
            "time_slot_id": booking.time_slot_id,
            "registrant_id": booking.registrant_id,
            "status": booking.status,
            "custom_field_data": booking.custom_field_data,
            "created_at": booking.created_at,
            "cancelled_at": booking.cancelled_at,
            # enriched fields
            "appointment_date": slot.start_time.date() if slot else None,
            "appointment_time": slot.start_time.time() if slot else None,
            "meeting_title": event.title if event else None,
            "organizer_name": organizer.name if organizer else None,
        })
    return bookings


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
    cancelled_by: str,
    reason: str | None = None
) -> Booking:
    booking.status = BookingStatus.cancelled
    booking.cancelled_by = cancelled_by
    booking.cancelled_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(booking)
    return booking


async def get_active_booking_count(db: AsyncSession, registrant_id: str) -> int:
    from sqlalchemy import func
    result = await db.execute(
        select(func.count())
        .select_from(Booking)
        .where(Booking.registrant_id == registrant_id)
        .where(Booking.status == BookingStatus.active)
    )
    return result.scalar_one()


async def get_all_bookings(db: AsyncSession) -> list[Booking]:
    result = await db.execute(
        select(Booking).order_by(Booking.created_at.desc())
    )
    return result.scalars().all()
