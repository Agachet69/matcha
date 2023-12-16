from pydantic import BaseModel

class PhotoBase(BaseModel):
  path: str

class PhotoCreate(PhotoBase):
  path: str
  user_id: int

class PhotoUpdate(PhotoBase):
    path: str

class PhotoInDBBase(PhotoBase):
    id: int

    class Config:
        orm_mode = True


class PhotoSchema(PhotoInDBBase):
    pass

