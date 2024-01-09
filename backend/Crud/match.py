from typing import Optional

from Schemas.notif import NotifCreate
from Enum.StatusEnum import StatusEnum

from .base import CRUDBase
from Model import Match
from Schemas.match import MatchCreate

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session, noload


class CRUDMatch(CRUDBase[Match, MatchCreate, MatchCreate]):
    pass


match = CRUDMatch(Match)
