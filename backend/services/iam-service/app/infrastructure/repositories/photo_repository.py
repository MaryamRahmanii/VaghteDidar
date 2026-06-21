from bson import ObjectId
from gridfs.errors import NoFile

from app.database.mongo import fs_bucket


async def upload_photo(
    file_byte: bytes, 
    filename: str, 
    content_type: str
) -> str:
    file_id = await fs_bucket.upload_from_stream(
        filename,
        file_byte,
        metadata={"content_type": content_type}
    )
    return str(file_id)


async def get_photo(file_id: str):
    try:
        grid_out = await fs_bucket.open_download_stream(ObjectId(file_id))
        content = await grid_out.read()
        content_type = grid_out.metadata.get(
            "content_type", "image/jpeg"
        ) if grid_out.metadata else "image/jpeg"
        return content, content_type
    except NoFile:
        return None, None


async def delete_photo(file_id: str):
    try:
        await fs_bucket.delete(ObjectId(file_id))
    except NoFile:
        pass
