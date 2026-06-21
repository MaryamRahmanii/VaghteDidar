from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from app.database.database import get_db

from app.domain.schemas.events import EventResponseSchema
from app.domain.schemas.slots import TimeSlotResponseSchema
from app.domain.schemas.organizers import SlotAvailabilityResponseSchema

from app.infrastructure.repositories.event_repository import (
    get_active_events, get_event
)
from app.infrastructure.repositories.slot_repository import (
    get_available_slots, get_slots_by_organizer
)


router = APIRouter(tags=["events"])


@router.get("/events", response_model=list[EventResponseSchema])
async def list_events(db=Depends(get_db)):
    return await get_active_events(db)


@router.get("/events/{event_id}", response_model=EventResponseSchema)
async def get_event_detail(event_id: UUID, db=Depends(get_db)):
    event = await get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found.")
    return event


@router.get("/events/{event_id}/slots", response_model=list[TimeSlotResponseSchema])
async def list_available_slots(event_id: UUID, db=Depends(get_db)):
    return await get_available_slots(db, event_id)


@router.get("/slots/available", response_model=list[SlotAvailabilityResponseSchema])
async def list_slots_by_organizer(organizer_id: UUID, db=Depends(get_db)):
    """
    Returns all non-cancelled slots for a given organizer across all their
    active events. Each slot includes id, time, and is_available so the
    frontend calendar can colour booked vs free slots without a second call.
    """
    return await get_slots_by_organizer(db, organizer_id)
