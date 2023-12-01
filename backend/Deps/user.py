from Schemas.user import UserSchema
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2AuthorizationCodeBearer

from Utils import get_db, security
import Crud

def get_user(
	user_id: int,
	db = Depends(get_db)
):
    user = Crud.user.get(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )

    return user

def get_current_user(token: str = Depends(security.verify_token), db = Depends(get_db)) -> UserSchema:
    user = Crud.user.get_from_key(db, 'username', token["username"])
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.password != token["password"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user