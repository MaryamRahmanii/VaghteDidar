from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.domain.user_role import UserRole


class OTPRequestSchema(BaseModel):
    phone_number: str
    type: str


class OTPLoginVerifySchema(BaseModel):
    phone_number: str
    otp_code: str


class OTPSignupVerifySchema(BaseModel):
    full_name: str
    phone_number: str
    otp_code: str


class TokenResponseSchema(BaseModel):
    access_token: str
    role: UserRole
    token_type: str = "bearer"


class UserSchema(BaseModel):
    user_id: UUID
    full_name: str
    phone_number: str
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserCreateSchema(BaseModel):
    full_name: str
    phone_number: str
    role: UserRole = UserRole.registrant
