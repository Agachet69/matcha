from typing import Any, Optional, List
from Schemas.token import TokenSchema
from Schemas.notif import NotifSchema
from Schemas.like import LikeSchema
from Enum.GenderEnum import GenderEnum
from Enum.SexualityEnum import SexualityEnum
from Enum.StatusEnum import StatusEnum

from pydantic import BaseModel, EmailStr, constr, validator

from Validators.user import user_name_validator, password_validator




class UserBase(BaseModel):
    username: Optional[constr(min_length=1)]
    lastName: Optional[constr(min_length=1)]
    firstName: Optional[constr(min_length=1)]
    email: Optional[constr(min_length=1)]
    gender: Optional[GenderEnum]
    sexuality: Optional[SexualityEnum]
    age: Optional[int]
    bio: Optional[str]
    # photos: Optional[List[str]]

    _validate_name_not_none = validator("username", allow_reuse=True)(user_name_validator)


class UserCreate(UserBase):
    username: constr(min_length=1)
    lastName: constr(min_length=1)
    firstName: constr(min_length=1)
    email: constr(min_length=1)
    gender: GenderEnum
    sexuality: SexualityEnum
    age: int
    bio: str
    # photos: Optional[List[str]]
    
    password: constr(min_length=1)
    
    
    
    # _validate_password = validator("password", allow_reuse=True)(password_validator('CREATE'))

class UserLogin(UserBase):
    username: constr(min_length=1)
    password: constr(min_length=1)
    
    
    
    # _validate_password = validator("password", allow_reuse=True)(password_validator('CREATE'))

class UserUpdate(UserBase):
    password: Optional[constr(min_length=1)]
    status: Optional[StatusEnum]
    
    # _validate_password = validator("password", allow_reuse=True)(password_validator('EDIT'))

class UserInDBBase(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserSchema(UserInDBBase):
    notifs: List[NotifSchema]
    likes: List[LikeSchema]
    liked_by: List[LikeSchema]
    photos: List[str]
    status: Optional[StatusEnum]
    
    