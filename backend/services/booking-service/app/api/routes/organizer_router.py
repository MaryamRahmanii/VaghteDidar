from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from app.database.database import get_db
from app.api.dependencies.api_dependency import get_current_user

from app.domain.schemas.bookings import BookingResponseSchema
from app.domain.schemas.events import (
    CustomFieldSchema, EventResponseSchema, 
    EventWithFieldsCreateSchema, EventCreateSchema
)
from app.domain.schemas.slots import (
    TimeSlotResponseSchema, TimeSlotBulkCreateSchema, SessionStatus
)

from app.infrastructure.repositories.event_repository import (
    create_event, get_event, update_event, add_custom_fields
)
from app.infrastructure.repositories.slot_repository import (
    bulk_create_slots, get_slot, update_slot_status
)
from app.infrastructure.repositories.booking_repository import get_event_bookings

from app.services.booking_service import cancel_booking


router = APIRouter(prefix="/organizer", tags=["organizer"])


def _require_organizer(user: dict):
    if user.get("role") not in ("organizer", "admin"):
        raise HTTPException(status_code=403, detail="Organizer access required.")


@router.post("/events", response_model=EventResponseSchema, status_code=201)
async def create_new_event(
    body: EventWithFieldsCreateSchema,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    _require_organizer(user)
    event = await create_event(db, user["user_id"], body.event.model_dump())
    if body.custom_fields:
        await add_custom_fields(
            db, event.id,
            [f.model_dump() for f in body.custom_fields]
        )
        await db.refresh(event)
    return event


@router.patch("/events/{event_id}", response_model=EventResponseSchema)
async def update_existing_event(
    event_id: UUID,
    body: EventCreateSchema,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    _require_organizer(user)
    event = await get_event(db, event_id)
    if not event or str(event.organizer_id) != user["user_id"]:
        raise HTTPException(status_code=404, detail="Event not found.")
    return await update_event(db, event, **body.model_dump(exclude_unset=True))


@router.delete("/events/{event_id}")
async def deactivate_event(
    event_id: UUID,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    _require_organizer(user)
    event = await get_event(db, event_id)
    if not event or str(event.organizer_id) != user["user_id"]:
        raise HTTPException(status_code=404, detail="Event not found.")
    await update_event(db, event, is_active=False)
    return {"message": "Event deactivated."}


@router.post("/events/{event_id}/fields", response_model=EventResponseSchema)
async def set_custom_fields(
    event_id: UUID,
    body: list[CustomFieldSchema],
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    _require_organizer(user)
    event = await get_event(db, event_id)
    if not event or str(event.organizer_id) != user["user_id"]:
        raise HTTPException(status_code=404, detail="Event not found.")
    await add_custom_fields(db, event_id, [f.model_dump() for f in body])
    await db.refresh(event)
    return event


@router.post("/slots", response_model=list[TimeSlotResponseSchema], status_code=201)
async def create_slots(
    body: TimeSlotBulkCreateSchema,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    _require_organizer(user)
    event = await get_event(db, body.event_id)
    if not event or str(event.organizer_id) != user["user_id"]:
        raise HTTPException(status_code=404, detail="Event not found.")
    windows = [w.model_dump() for w in body.available_windows]
    return await bulk_create_slots(db, body.event_id, windows, event.session_duration_minutes)


@router.delete("/slots/{slot_id}")
async def delete_slot(
    slot_id: UUID,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    _require_organizer(user)
    slot = await get_slot(db, slot_id)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found.")
    await update_slot_status(db, slot, SessionStatus.cancelled)
    return {"message": "Slot removed."}


@router.get("/events/{event_id}/bookings", response_model=list[BookingResponseSchema])
async def event_bookings(
    event_id: UUID,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    _require_organizer(user)
    return await get_event_bookings(db, event_id)


@router.delete("/bookings/{booking_id}", response_model=BookingResponseSchema)
async def organizer_cancel_booking(
    booking_id: UUID,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    _require_organizer(user)
    return await cancel_booking(db, booking_id, "organizer", user)
