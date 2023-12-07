from typing import Any, Optional, List
from Schemas.token import TokenSchema
from Enum.NotifType import NotifType

from pydantic import BaseModel, EmailStr, constr, validator

from Validators.user import user_name_validator, password_validator




class NotifBase(BaseModel):
    data: str
    type: NotifType

class NotifCreate(NotifBase):
	pass

class NotifInDBBase(NotifBase):
    id: int

    class Config:
        orm_mode = True


class NotifSchema(NotifInDBBase):
    # type: Any
    pass