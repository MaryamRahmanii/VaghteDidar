from enum import Enum

class UserRole(str, Enum):
    registrant = "registrant"
    organizer = "organizer"
    admin = "admin"
