import uuid
from sqlalchemy import (
    Column, String, Text, DateTime, Enum, Integer, Boolean, ForeignKey
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base

from app.domain.booking_status import BookingStatus
from app.domain.session_status import SessionStatus


class OrganizerProfile(Base):
    __tablename__ = "organizer_profiles"

    organizer_id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(255), nullable=False)
    specialty = Column(String(255), nullable=True)
    avatar_url = Column(String(512), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organizer_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    session_duration_minutes = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    custom_fields = relationship("EventCustomField", back_populates="event", lazy="selectin")
    time_slots = relationship("TimeSlot", back_populates="event", lazy="selectin")


class EventCustomField(Base):
    __tablename__ = "event_custom_fields"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    field_label = Column(String(100), nullable=False)
    field_type = Column(String(30), default="text")
    is_required = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)

    event = relationship("Event", back_populates="custom_fields")


class TimeSlot(Base):
    __tablename__ = "time_slots"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(SessionStatus), default=SessionStatus.available)

    event = relationship("Event", back_populates="time_slots")
    booking = relationship("Booking", back_populates="time_slot", lazy="selectin")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    time_slot_id = Column(UUID(as_uuid=True), ForeignKey("time_slots.id"), nullable=False)
    registrant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    status = Column(Enum(BookingStatus), default=BookingStatus.active)
    custom_field_data = Column(JSONB, nullable=True)
    cancelled_by = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    cancelled_at = Column(DateTime(timezone=True), nullable=True)

    time_slot = relationship("TimeSlot", back_populates="booking")