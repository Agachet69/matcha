from pydantic import BaseModel
from Enum.TagEnum import TagEnum

class TagBase(BaseModel):
  tag: TagEnum
  
class TagCreate(TagBase):
  tag: TagEnum


class TagUpdate(TagBase):
  tag: TagEnum

class TagInDBBase(TagBase):
    id: int

    class Config:
      orm_mode = True

class TagSchema(TagInDBBase):
  pass

