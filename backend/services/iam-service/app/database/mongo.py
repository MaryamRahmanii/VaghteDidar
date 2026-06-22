import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from app.core.config import settings

_mongo_client = None

def get_fs_bucket() -> AsyncIOMotorGridFSBucket:
    global _mongo_client
    if _mongo_client is None:
       
        _mongo_client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URL)
    
    mongo_db = _mongo_client[settings.MONGO_DB_NAME]
    return AsyncIOMotorGridFSBucket(mongo_db, bucket_name="profile_photos")