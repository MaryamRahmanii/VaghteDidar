from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from app.database.database import get_db

from app.domain.schemas.events import EventResponseSchema
from app.domain.schemas.slots import TimeSlotResponseSchema

from app.infrastructure.repositories.event_repository import (
    get_active_events, get_event
)
from app.infrastructure.repositories.slot_repository import get_available_slots


router = APIRouter(tags=["events"])


@router.get(
    "/events", 
    response_model=list[EventResponseSchema]
)
async def list_events(db=Depends(get_db)):
    return await get_active_events(db)


@router.get(
    "/events/{event_id}", 
    response_model=EventResponseSchema
)
async def get_event_detail(event_id: UUID, db=Depends(get_db)):
    event = await get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found.")
    return event


@router.get(
    "/events/{event_id}/slots", 
    response_model=list[TimeSlotResponseSchema]
)
async def list_available_slots(event_id: UUID, db=Depends(get_db)):
    return await get_available_slots(db, event_id)
