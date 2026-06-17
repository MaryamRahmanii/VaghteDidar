from enum import Enum


class BookingStatus(str, Enum):
    active = "active"
    cancelled = "cancelled"
    completed = "completed"
