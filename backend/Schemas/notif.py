from typing import Any, Optional, List
from Schemas.token import TokenSchema
from Enum.NotifTypeEnum import NotifTypeEnum

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


class NotifSchema(NotifInDBBase):
    data_user: Optional[Any]