from typing import Any, Optional, List
from Schemas.token import TokenSchema
from Enum.NotifTypeEnum import NotifTypeEnum
from Enum.GenderEnum import GenderEnum
from Enum.SexualityEnum import SexualityEnum


from pydantic import BaseModel, EmailStr, constr, validator

from Validators.user import user_name_validator, password_validator




class BlockBase(BaseModel):
    user_id: Optional[int]
    user_target_id: Optional[int]

class BlockCreate(BlockBase):
	pass

class BlockInDBBase(BlockBase):
    id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    username: Optional[constr(min_length=1)]
    lastName: Optional[constr(min_length=1)]
    firstName: Optional[constr(min_length=1)]
    email: Optional[constr(min_length=1)]
    gender: Optional[GenderEnum]
    sexuality: Optional[SexualityEnum]
    age: Optional[int]
    bio: Optional[str]
    class Config:
        orm_mode = True

class BlockSchema(BlockInDBBase):
    user_target: Optional[UserBase]
    