from typing import Any, Optional, List
from Schemas.token import TokenSchema
from Enum.NotifTypeEnum import NotifTypeEnum
from Enum.GenderEnum import GenderEnum
from Enum.SexualityEnum import SexualityEnum
from Schemas.photo import PhotoSchema

from pydantic import BaseModel, EmailStr, constr, validator

from Validators.user import user_name_validator, password_validator




class NotifBase(BaseModel):
    type: NotifTypeEnum
    data: str
    data_user_id: Optional[int]

class NotifCreate(NotifBase):
	pass

class NotifInDBBase(NotifBase):
    id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    id: int
    username: Optional[constr(min_length=1)]
    lastName: Optional[constr(min_length=1)]
    firstName: Optional[constr(min_length=1)]
    email: Optional[constr(min_length=1)]
    gender: Optional[GenderEnum]
    sexuality: Optional[SexualityEnum]
    age: Optional[int]
    bio: Optional[str]
    photos: List[PhotoSchema]
    class Config:
        orm_mode = True

class NotifSchema(NotifInDBBase):
    data_user: Optional[UserBase]