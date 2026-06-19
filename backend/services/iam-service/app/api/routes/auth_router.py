from fastapi import APIRouter, HTTPException, Depends, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.database.database import get_db
from app.api.dependencies.auth_dependency import get_current_user

from app.domain.schemas.users import (
    OTPRequestSchema, OTPLoginVerifySchema, OTPSignupVerifySchema, 
    TokenResponseSchema, UserSchema
)

from app.services import otp_service, session_service
from app.infrastructure.repositories import user_repository


router = APIRouter(prefix="/auth", tags=["Auth"])
bearer_scheme = HTTPBearer()

@router.post("/otp/login/request")
async def request_login_otp(body: OTPRequestSchema, db=Depends(get_db)):
    user = await user_repository.get_user(
        db, body.phone_number
    )
    if not user:
        raise HTTPException(
            detail="User not found.", status_code=status.HTTP_404_NOT_FOUND
        )
    await otp_service.request_otp(user.phone_number)
    return {"message": "OTP sent"}


@router.post("/otp/login/verify", response_model=TokenResponseSchema)
async def verify_login_otp(body: OTPLoginVerifySchema, db=Depends(get_db)):
    try:
        await otp_service.verify_otp(body.phone_number, body.otp_code)
    except:
        raise HTTPException(
            detail="Invalid or expired OTP.", 
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    user = await user_repository.get_user(
        db, body.phone_number
    )
    if not user:
        raise HTTPException(
            detail="User not found.", status_code=status.HTTP_404_NOT_FOUND
        )
    token = await session_service.create_session(
        str(user.user_id), user.role.value
    )
    return TokenResponseSchema(access_token=token, role=user.role)


@router.post("/otp/signup/request")
async def request_signup_otp(body: OTPRequestSchema, db=Depends(get_db)):
    # ۱. چک کن ببین کاربر قبلاً ثبت‌نام کرده یا نه
    user = await user_repository.get_user(db, body.phone_number)
    
    # ۲. اگر کاربر وجود داشت، یعنی ثبت‌نام تکراری است
    if user:
        raise HTTPException(
            detail=f"User already signed up with phone number {body.phone_number}",
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    # ۳. اگر کاربر وجود نداشت (None بود)، از همان body.phone_number استفاده کن
    # مشکل شما اینجا بود که از user.phone_number استفاده می‌کردید!
    await otp_service.request_otp(body.phone_number) 
    
    return {"message": "OTP sent for signup"}

@router.post("/otp/signup/verify", response_model=TokenResponseSchema)
async def verify_signup_otp(body: OTPSignupVerifySchema, db=Depends(get_db)):
    # ۱. همونطور که بک‌اندکار گفت: قسمت اول رو داخل try except می‌ذاریم
    try:
        await otp_service.verify_otp(body.phone_number, body.otp_code)
    except:
        raise HTTPException(
            detail="Invalid or expired OTP.",
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    # ۲. بعد اون هم user رو می‌گیریم و چک می‌کنیم که از قبل داخل دیتابیس نباشه
    user = await user_repository.get_user(db, body.phone_number)
    if user:
        raise HTTPException(
            detail=f"User already signed up with phone number {body.phone_number}",
            status_code=status.HTTP_400_BAD_REQUEST
        )

    # ۳. اینجا کاربر جدید رو می‌سازیم (همون جایی که ارور TypeError می‌داد)
    new_user = await user_repository.create_user(
        db,
        phone_number=body.phone_number,
        full_name=body.full_name
    )

    # ۴. ساخت سشن
    token = await session_service.create_session(
        str(new_user.user_id),
        new_user.role.value
    )
    return TokenResponseSchema(access_token=token, role=new_user.role)



@router.post("/logout")
async def logout(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)
):
    token = credentials.credentials
    await session_service.delete_session(token)
    return {"message": "logged out"}


@router.get("/me", response_model=UserSchema)
async def me(user=Depends(get_current_user)):
    return user
