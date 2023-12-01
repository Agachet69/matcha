from typing import Any, Optional, List
from Schemas.token import TokenSchema

from pydantic import BaseModel, EmailStr, constr, validator

from Validators.user import user_name_validator, password_validator




class UserBase(BaseModel):
    username: Optional[constr(min_length=1)]

    _validate_name_not_none = validator("username", allow_reuse=True)(user_name_validator)


class UserCreate(UserBase):
    username: constr(min_length=1)
    password: constr(min_length=1)
    
    # _validate_password = validator("password", allow_reuse=True)(password_validator('CREATE'))


class UserUpdate(UserBase):
    password: Optional[constr(min_length=1)]
    
    # _validate_password = validator("password", allow_reuse=True)(password_validator('EDIT'))

class UserInDBBase(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserSchema(UserInDBBase):
    notifs: List[Any]
    