from enum import Enum


class NotificationType(str, Enum):
    booking_confirmed = "booking_confirmed"
    booking_cancelled = "booking_cancelled"
    organizer_message = "organizer_message"
    otp = "otp"
