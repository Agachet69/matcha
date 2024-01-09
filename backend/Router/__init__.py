from fastapi import APIRouter

from Router import user, message, photo

api_router = APIRouter()

api_router.include_router(user.router)
api_router.include_router(message.router)
api_router.include_router(photo.router)