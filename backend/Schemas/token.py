from pydantic import BaseModel, EmailStr, constr, validator

class TokenSchema(BaseModel):
    access_token: constr(min_length=1)
    token_type: constr(min_length=1)