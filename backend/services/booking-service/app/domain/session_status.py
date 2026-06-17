from enum import Enum


class SessionStatus(str, Enum):
    available = "available"
    booked = "booked"
    cancelled = "cancelled"
    completed = "completed"
