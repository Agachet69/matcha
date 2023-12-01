from typing import List
from Utils import get_db
from Schemas.token import TokenSchema
from fastapi import APIRouter, Depends, HTTPException, status
from Schemas.user import UserSchema, UserCreate, UserUpdate
import Crud
from Deps.user import get_user, get_current_user
from Utils import security

router = APIRouter(prefix="/users", tags=["Users"])

@router.get(
	"/",
	status_code=status.HTTP_200_OK,
    response_model=List[UserSchema])
def get_all_users(
	db = Depends(get_db)
):
    return Crud.user.get_all(db)

@router.post(
	"/sign_up",
	status_code=status.HTTP_200_OK,
    response_model=TokenSchema)
def sign_up(
    user_to_create: UserCreate,
	db = Depends(get_db)
):
    if user := Crud.user.get_from_key(db, "username", user_to_create.username):
        raise HTTPException(status_code=400, detail="username already taken.")

    user_to_create.password =  security.hash_password(user_to_create.password)
    user = Crud.user.create(db, user_to_create)
    
    return {"access_token": security.create_jwt_token({"username": user_to_create.username, "password": user_to_create.password}), "token_type": "bearer"}

@router.post(
	"/sign_in",
	status_code=status.HTTP_200_OK,
    response_model=TokenSchema)
def sign_in(
    user_to_login: UserCreate,
	db = Depends(get_db)
):
    if not (user := Crud.user.get_from_key(db, "username", user_to_login.username)):
        raise HTTPException(status_code=404, detail="Username incorrect")
    if not security.verify_password(user_to_login.password, user.password):
        raise HTTPException(status_code=400, detail="Password incorrect")
    return {"access_token": security.create_jwt_token({"username": user.username, "password": user.password}), "token_type": "bearer"}

@router.get("/me", status_code=status.HTTP_200_OK,
    response_model=UserSchema)
def get_me(current_user: UserSchema = Depends(get_current_user)):
    print(current_user.notifs)
    # delattr(current_user, 'password')
    return current_user

@router.get("/add_notif", status_code=status.HTTP_200_OK,
    response_model=UserSchema)
def get_me(current_user: UserSchema = Depends(get_current_user), db = Depends(get_db)):
    return Crud.user.add_notif(db, current_user)


