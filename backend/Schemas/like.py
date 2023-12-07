from typing import Any, Optional, List
from Schemas.token import TokenSchema
from Enum.NotifTypeEnum import NotifTypeEnum

from pydantic import BaseModel, EmailStr, constr, validator

from Validators.user import user_name_validator, password_validator




class LikeBase(BaseModel):
    user_id: int
    user_target_id: int

class LikeCreate(LikeBase):
	pass

class LikeInDBBase(LikeBase):
    id: int

    class Config:
        orm_mode = True


class LikeSchema(LikeInDBBase):
    pass