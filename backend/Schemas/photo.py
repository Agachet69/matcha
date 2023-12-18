from pydantic import BaseModel
from typing import Optional


class PhotoBase(BaseModel):
  path: str
  main: bool
  
class PhotoCreate(PhotoBase):
  path: str
  user_id: int
  main: bool

class PhotoUpdate(PhotoBase):
    path: str

class PhotoInDBBase(PhotoBase):
    id: int

    class Config:
        orm_mode = True

class PhotoSchema(PhotoInDBBase):
    pass

