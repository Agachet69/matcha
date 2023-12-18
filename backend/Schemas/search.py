import datetime
from typing import Any, Optional, List
from Schemas.token import TokenSchema
from Schemas.notif import NotifSchema
from Schemas.like import LikeSchema
from Schemas.match import MatchSchema
from Enum.GenderEnum import GenderEnum
from Enum.SexualityEnum import SexualityEnum
from Enum.StatusEnum import StatusEnum

from pydantic import BaseModel, EmailStr, constr, validator

from Validators.user import user_name_validator, password_validator



class SearchParam(BaseModel):
    min: int
    max: int


class SearchSchema(BaseModel):
    age_limit: Optional[SearchParam]
    fame_rate_limit: Optional[SearchParam]
    location_limit: Optional[SearchParam]