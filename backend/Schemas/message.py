from typing import Any, Optional, List
from Schemas.token import TokenSchema
from Enum.NotifTypeEnum import NotifTypeEnum
from Enum.GenderEnum import GenderEnum
from Enum.SexualityEnum import SexualityEnum
from datetime import datetime

from pydantic import BaseModel, EmailStr, constr, validator

from Validators.user import user_name_validator, password_validator




class MessageBase(BaseModel):
    user_A_id: Optional[int]
    user_B_id: Optional[int]
    data: Optional[str]

class MessageCreate(MessageBase):
    data: str

class MessageInDBBase(MessageBase):
    id: int

    class Config:
        orm_mode = True

class MessageSchema(MessageInDBBase):
    date: datetime
    