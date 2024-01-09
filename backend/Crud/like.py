from typing import Optional

from Schemas.notif import NotifCreate
from Enum.StatusEnum import StatusEnum

from .base import CRUDBase
from Model import Like
from Schemas.like import LikeCreate

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session, noload


class CRUDLike(CRUDBase[Like, LikeCreate, LikeCreate]):
    pass


like = CRUDLike(Like)
