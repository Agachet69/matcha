from pydantic import BaseModel, EmailStr, constr, validator

class PhotoSchema(BaseModel):
  path: str

  class Config:
    orm_mode = True