from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.redis import redis_client
from app.core.config import settings
from app.domain.session_status import SessionStatus
from app.domain.booking_status import BookingStatus
from app.infrastructure.repositories import booking_repository, slot_repository
from app.services.notification_client import notify

SLOT_LOCK_TTL = 10
ACTIVE_COUNT_TTL = 86400


def _active_count_key(user_id: str) -> str:
    return f"booking:active_count:{user_id}"

def _slot_lock_key(slot_id: str) -> str:
    return f"booking:lock:slot:{slot_id}"


async def _get_active_count(db: AsyncSession, user_id: str) -> int:
    """
    Return active booking count, seeding Redis from DB on cache miss.
    Prevents the limit from being bypassed after a service restart.
    """
    active_key = _active_count_key(user_id)
    count = await redis_client.get(active_key)
    if count is not None:
        return int(count)

    db_count = await booking_repository.get_active_booking_count(db, user_id)
    await redis_client.set(active_key, db_count, ex=ACTIVE_COUNT_TTL)
    return db_count


async def create_booking(
    db: AsyncSession,
    time_slot_id: UUID,
    user: dict,
    custom_field_data: dict
):
    user_id = user["user_id"]
    active_key = _active_count_key(user_id)

    count = await _get_active_count(db, user_id)
    if count >= settings.MAX_ACTIVE_BOOKINGS:
        raise HTTPException(
            status_code=429,
            detail=f"You already have {settings.MAX_ACTIVE_BOOKINGS} active bookings. "
                   f"Cancel one before booking again."
        )

    lock_key = _slot_lock_key(str(time_slot_id))
    acquired = await redis_client.set(lock_key, 1, nx=True, ex=SLOT_LOCK_TTL)
    if not acquired:
        raise HTTPException(
            status_code=409,
            detail="This slot is currently being booked. Please try again."
        )

    try:
        slot = await slot_repository.get_slot(db, time_slot_id)
        if not slot or slot.status != SessionStatus.available:
            raise HTTPException(status_code=409, detail="This slot is no longer available.")

        booking = await booking_repository.create_booking(
            db, time_slot_id, user_id, custom_field_data
        )
        await slot_repository.update_slot_status(db, slot, SessionStatus.booked)

        await redis_client.incr(active_key)
        await redis_client.expire(active_key, ACTIVE_COUNT_TTL)

        await notify(
            recipient_phone=user.get("phone_number", ""),
            notification_type="booking_confirmed",
            message_body=f"Your booking has been confirmed for {slot.start_time.strftime('%Y-%m-%d %H:%M')}.",
            recipient_user_id=user_id,
            related_booking_id=str(booking.id)
        )

        return booking

    finally:
        await redis_client.delete(lock_key)


async def cancel_booking(
    db: AsyncSession,
    booking_id: UUID,
    cancelled_by: str,
    user: dict,
    reason: str | None = None
):
    booking = await booking_repository.get_booking(db, booking_id)

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    if booking.status != BookingStatus.active:
        raise HTTPException(status_code=409, detail="Booking is already cancelled or completed.")

    if cancelled_by == "registrant" and str(booking.registrant_id) != user["user_id"]:
        raise HTTPException(status_code=403, detail="You can only cancel your own bookings.")

    booking = await booking_repository.cancel_booking(db, booking, cancelled_by, reason)
    slot = await slot_repository.get_slot(db, booking.time_slot_id)
    await slot_repository.update_slot_status(db, slot, SessionStatus.available)

    active_key = _active_count_key(str(booking.registrant_id))
    count = await redis_client.get(active_key)
    if count and int(count) > 0:
        await redis_client.decr(active_key)

    await notify(
        recipient_phone=user.get("phone_number", ""),
        notification_type="booking_cancelled",
        message_body="Your booking has been cancelled.",
        recipient_user_id=str(booking.registrant_id),
        related_booking_id=str(booking.id)
    )

    return booking