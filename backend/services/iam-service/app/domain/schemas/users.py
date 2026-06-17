from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

from app.domain.user_role import UserRole


class OTPRequestSchema(BaseModel):
    phone_number: str


class OTPVerifySchema(BaseModel):
    full_name: str
    phone_number: str
    otp_code: str


class TokenResponseSchema(BaseModel):
    access_token: str
    role: UserRole
    token_type: str = "bearer"


class UserSchema(BaseModel):
    id: UUID
    full_name: str
    phone_number: str
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreateSchema(BaseModel):
    full_name: str
    phone_number: str
    role: UserRole = UserRole.registrant
