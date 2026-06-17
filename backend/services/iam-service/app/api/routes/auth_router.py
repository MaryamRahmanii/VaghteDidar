from fastapi import APIRouter, Header, Depends

from app.database.database import get_db
from app.api.dependencies.auth_dependency import get_current_user

from app.domain.schemas.users import (
    OTPRequestSchema, OTPVerifySchema, TokenResponseSchema, UserSchema
)

from app.services import otp_service, session_service
from app.infrastructure.repositories import user_repository


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/otp/request")
async def request_otp(body: OTPRequestSchema):
    await otp_service.request_otp(body.phone_number)
    return {"message": "OTP sent"}


@router.post("/otp/verify", response_model=TokenResponseSchema)
async def verify_otp(body: OTPVerifySchema, db=Depends(get_db)):
    await otp_service.verify_otp(body.phone_number, body.otp_code)
    user = await user_repository.get_or_create_user(db, body.phone_number)
    token = await session_service.create_session(str(user.id), user.role.value)
    return TokenResponseSchema(access_token=token, role=user.role)


@router.post("/logout")
async def logout(authorization: str = Header(...)):
    _, _, token = authorization.partition(" ")
    await session_service.delete_session(token)
    return {"message": "logged out"}


@router.get("/me", response_model=UserSchema)
async def me(user=Depends(get_current_user)):
    return user
