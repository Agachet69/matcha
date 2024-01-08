from typing import List
from Utils import get_db
from Schemas.token import TokenSchema
from Schemas.notif import NotifCreate
from Enum.NotifTypeEnum import NotifTypeEnum
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from Schemas.user import UserLogin, UserSchema, UserCreate, UserUpdate
from Schemas.tag import TagCreate
import Crud
from Deps.user import get_user, get_current_user
from Utils import security
import uuid
from pathlib import Path as PathLib
from sqlalchemy.orm import Session
import Model 

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register", status_code=status.HTTP_200_OK, response_model=TokenSchema)
def register(user_to_create: UserCreate, db=Depends(get_db)):
    if user := Crud.user.get_from_key(db, "username", user_to_create.username):
        raise HTTPException(status_code=400, detail="username already taken.")

    user_to_create.password = security.hash_password(user_to_create.password)
    user = Crud.user.create(db, user_to_create)

    return {
        "access_token": security.create_jwt_token(
            {"username": user_to_create.username, "password": user_to_create.password}
        ),
        "token_type": "bearer",
    }

@router.post("/login", status_code=status.HTTP_200_OK, response_model=TokenSchema)
def login(user_to_login: UserLogin, db=Depends(get_db)):
    if not (user := Crud.user.get_from_key(db, "username", user_to_login.username)):
        raise HTTPException(status_code=404, detail="Username incorrect")
    if not security.verify_password(user_to_login.password, user.password):
        raise HTTPException(status_code=400, detail="Password incorrect")
    return {
        "access_token": security.create_jwt_token(
            {"username": user.username, "password": user.password}
        ),
        "token_type": "bearer",
    }

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[UserSchema])
def get_all_users(
    current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)
):
    return Crud.user.get_all(db)

@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserSchema)
def get_me(current_user: UserSchema = Depends(get_current_user)):
    return current_user

@router.put('/', status_code=status.HTTP_200_OK, response_model=UserSchema)
def update_user(user_update: UserUpdate, current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)):
  return Crud.user.update(db, db_obj=current_user, obj_in=user_update)

@router.put('/tags', response_model=UserSchema)
def update_tags(tags: List[TagCreate], current_user= Depends(get_current_user), db= Depends(get_db)):
  
  if (len(tags) > 5):
    raise HTTPException(status_code=400, detail="You can't have more than 5 tags.")
  
  user = Crud.user.get(db, current_user.id)
  if user is None:
    raise HTTPException(status_code=404, detail="User not found")
  
  all_tags = []
  for exist_tag in tags:
    tag = Crud.tag.get_or_create_tag(db, exist_tag)
    all_tags.append(tag)
    
  user.tags = all_tags
  db.commit()
  db.refresh(user)
  
  return user

# @router.get("/add_notif", status_code=status.HTTP_200_OK, response_model=UserSchema)
# def get_me(current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)):
#     notif = NotifCreate(type=NotifTypeEnum.ERROR, data="Error")
#     return Crud.user.add_notif(db, current_user, notif)
