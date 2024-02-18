import datetime
from typing import Any, Optional, List
from Schemas.token import TokenSchema
from Schemas.notif import NotifSchema
from Schemas.like import LikeSchema
from Schemas.like_photo import LikePhotoSchema
from Schemas.block import BlockSchema
from Schemas.photo import PhotoSchema, PhotoSchema
from Schemas.tag import TagSchema
from Schemas.match import MatchSchema
from Schemas.profile_seen import ProfileSeenSchema
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
    fame_rate: Optional[int]
    last_connection_date: Optional[datetime.datetime]

    _validate_name_not_none = validator("username", allow_reuse=True)(user_name_validator)


class UserCreate(UserBase):
    username: str
    lastName: str
    firstName: str
    email: str
    gender: GenderEnum
    sexuality: SexualityEnum
    age: int
    bio: str
    password: constr(min_length=1, max_length=256)
    latitude: int
    longitude: int
    
    _validate_password = validator("password", allow_reuse=True)(password_validator('CREATE'))

class UserLogin(UserBase):
    username: constr(min_length=1)
    password: constr(min_length=1)
    latitude: int
    longitude: int
    
    _validate_password = validator("password", allow_reuse=True)(password_validator('CREATE'))

class ValidateEmail(BaseModel):
    code: str

class ForgotPasswordSendCode(BaseModel):
    username: Optional[constr(min_length=1)]

    _validate_name_not_none = validator("username", allow_reuse=True)(user_name_validator)

class ForgotPassword(BaseModel):
    code: str
    username: Optional[constr(min_length=1)]
    password: constr(min_length=1)

class ChangePassword(BaseModel):
    last_password: constr(min_length=1)
    new_password: constr(min_length=1)

    _validate_password = validator("new_password", allow_reuse=True)(password_validator('EDIT'))
    
class UserUpdate(UserBase):
    password: Optional[constr(min_length=1)]
    latitude: Optional[int]
    longitude: Optional[int]
    verification_code: Optional[str]
    email_check: Optional[bool]
    
    _validate_password = validator("password", allow_reuse=True)(password_validator('EDIT'))

class UserInDBBase(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserSchema(UserInDBBase):
    notifs: List[NotifSchema]
    likes: List[LikeSchema]
    liked_by: List[LikeSchema]
    like_photos: List[LikePhotoSchema]
    profile_seen: List[ProfileSeenSchema]
    profile_seen_by: List[ProfileSeenSchema]
    photos: List[PhotoSchema]
    tags: List[TagSchema]
    matches: List[MatchSchema]
    blocked: List[BlockSchema]
    status: Optional[StatusEnum]
    latitude: Optional[int]
    longitude: Optional[int]
    email_check: bool

class UserSearchSchema(UserInDBBase):
    notifs: List[NotifSchema]
    likes: List[LikeSchema]
    liked_by: List[LikeSchema]
    like_photos: List[LikePhotoSchema]
    profile_seen: List[ProfileSeenSchema]
    profile_seen_by: List[ProfileSeenSchema]
    photos: List[PhotoSchema]
    tags: List[TagSchema]
    matches: List[MatchSchema]
    blocked: List[BlockSchema]
    status: Optional[StatusEnum]
    email_check: bool
    distance: int