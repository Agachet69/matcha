from fastapi import APIRouter

from Router import user

api_router = APIRouter()


api_router.include_router(user.router)