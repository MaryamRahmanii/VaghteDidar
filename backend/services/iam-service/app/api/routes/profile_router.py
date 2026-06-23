from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from fastapi.responses import StreamingResponse
import io
from pydantic import BaseModel

from app.database.database import get_db
from app.api.dependencies.auth_dependency import get_current_user
from app.infrastructure.repositories import photo_repository, user_repository
from app.domain.schemas.users import ProfilePhotoUploadResponseSchema


router = APIRouter(prefix="/profile", tags=["Auth"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024



class ProfileInfoUpdateSchema(BaseModel):
    full_name: str
    phone_number: str


@router.post("/photo", response_model=ProfilePhotoUploadResponseSchema)
async def upload_profile_photo(
    file: UploadFile = File(...),
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    file_byte = await file.read()
    if len(file_byte) > MAX_FILE_SIZE:
        raise HTTPException(
            detail="File too large. Max size is 5MB.",
            status_code=status.HTTP_413_CONTENT_TOO_LARGE
        )

    db_user = await user_repository.get_user_by_id(db, user.user_id)
    if not db_user:
        raise HTTPException(
            detail="User not found.",
            status_code=status.HTTP_404_NOT_FOUND
        )

    if db_user.profile_photo_id:
        await photo_repository.delete_photo(db_user.profile_photo_id)

    file_id = await photo_repository.upload_photo(
        file_byte, file.filename, file.content_type
    )
    await user_repository.update_user(db, db_user, profile_photo_id=file_id)

    return ProfilePhotoUploadResponseSchema(
        profile_photo_id=file_id,
        profile_photo_url=f"/profile/photo/{file_id}"
    )


@router.get("/photo/{file_id}")
async def get_profile_photo(file_id: str):
    content, content_type = await photo_repository.get_photo(file_id)
    if content is None:
        raise HTTPException(
            detail="Photo not found.",
            status_code=status.HTTP_404_NOT_FOUND
        )
    return StreamingResponse(io.BytesIO(content), media_type=content_type)


@router.delete("/photo")
async def delete_photo(
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    db_user = await user_repository.get_user_by_id(db, user.user_id)
    if not db_user or not db_user.profile_photo_id:
        raise HTTPException(
            detail="No profile photo set.",
            status_code=status.HTTP_404_NOT_FOUND
        )

    await photo_repository.delete_photo(db_user.profile_photo_id)
    await user_repository.update_user(db, db_user, profile_photo_id=None)

    return {"message": "Profile photo deleted."}


@router.put("/info")
async def update_profile_info(
    body: ProfileInfoUpdateSchema,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    db_user = await user_repository.get_user_by_id(db, user.user_id)
    if not db_user:
        raise HTTPException(
            detail="User not found.",
            status_code=status.HTTP_404_NOT_FOUND
        )
    
   
    if body.phone_number != db_user.phone_number:
        existing_user = await user_repository.get_user(db, body.phone_number)
        if existing_user:
            raise HTTPException(
                detail="این شماره موبایل قبلاً توسط شخص دیگری ثبت شده است.",
                status_code=status.HTTP_400_BAD_REQUEST
            )
    
   
    await user_repository.update_user(
        db, 
        db_user, 
        full_name=body.full_name, 
        phone_number=body.phone_number
    )
    return {"message": "Profile info updated successfully."}