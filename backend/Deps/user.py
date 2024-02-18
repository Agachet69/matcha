from Model import User
from Schemas.user import UserSchema
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2AuthorizationCodeBearer
from Utils import get_db, security
import Crud
from typing import Literal, Optional
from Schemas.user import UserCreate, UserUpdate

special_characters_username = ['_']


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

def get_current_user(token: str = Depends(security.verify_token), db = Depends(get_db))-> User:
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

def is_valid_username(value: str):
    if not value:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="username must be at least 3 long",
            )
    if len(value) < 3 or len(value) > 30:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="username must be between 3 and 30 characters.",
            )
    for c in value:
        if (not c.isalpha() and not c.isnumeric() and c not in special_characters_username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid username"
            )

def is_valid_name(value: str):
    if not value:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="name must be at least 3 long",
            )
    if len(value) < 3 or len(value) > 30:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="name must be between 3 and 30 characters.",
            )
    for c in value:
        if (not c.isalpha()):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid name"
            )

def is_valid_email(value: str):
    if not value:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="email must be at least 3 long",
            )
    if len(value) < 3 or len(value) > 50:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email must be between 3 and 50 characters.",
            )

def is_valid_age(value: int):
    if value < 18 or value > 122:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid age"
        )

def is_valid_bio(value: str):
    if (value and len(value) > 400):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Biography must not exceed 400 characters",
        )

def is_valid_position(value: int):
    if value > 180 or value < -180:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid position",
        )  

def user_create_validator(value: UserCreate):
    is_valid_username(value.username)
    is_valid_name(value.lastName)
    is_valid_name(value.firstName)
    is_valid_email(value.email)
    is_valid_age(value.age)
    is_valid_bio(value.bio)
    is_valid_position(value.latitude)
    is_valid_position(value.longitude)

def user_update_validator(value: UserUpdate):
    is_valid_username(value.username)
    is_valid_name(value.lastName)
    is_valid_name(value.firstName)
    is_valid_email(value.email)
    is_valid_age(value.age)
    is_valid_bio(value.bio)
    is_valid_position(value.latitude)
    is_valid_position(value.longitude)