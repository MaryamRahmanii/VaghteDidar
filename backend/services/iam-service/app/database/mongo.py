import motor.motor_asyncio

from motor.motor_asyncio import AsyncIOMotorGridFSBucket

from app.core.config import settings

mongo_client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URL)
mongo_db = mongo_client[settings.MONGO_DB_NAME]


fs_bucket = AsyncIOMotorGridFSBucket(mongo_db, bucket_name="profile_photos")