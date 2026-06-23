from bson import ObjectId
from app.database.mongo import get_fs_bucket

async def upload_photo(file_byte: bytes, filename: str, content_type: str) -> str:
    fs_bucket = get_fs_bucket()
    file_id = await fs_bucket.upload_from_stream(
        filename,
        file_byte,
        metadata={"contentType": content_type}
    )
    return str(file_id)

async def get_photo(file_id: str):
    fs_bucket = get_fs_bucket()
    try:
        grid_out = await fs_bucket.open_download_stream(ObjectId(file_id))
        content = await grid_out.read()
        return content, grid_out.metadata.get("contentType", "image/jpeg")
    except Exception:
        return None, None

async def delete_photo(file_id: str):
    fs_bucket = get_fs_bucket()
    try:
        await fs_bucket.delete(ObjectId(file_id))
    except Exception:
        pass