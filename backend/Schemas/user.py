from typing import Optional, List

from pydantic import BaseModel, EmailStr, constr, validator

from Validators.user import user_name_validator





class UserBase(BaseModel):
    username: Optional[constr(min_length=1)]

    _validate_name_not_none = validator("username", allow_reuse=True)(user_name_validator)


class UserCreate(UserBase):
    username: constr(min_length=1)



class UserUpdate(UserBase):
	pass

class UserInDBBase(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserSchema(UserInDBBase):
    pass