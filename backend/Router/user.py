from typing import List
from Utils import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from Schemas.user import UserSchema, UserCreate, UserUpdate
import Crud
from Deps.user import get_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get(
	"/",
	status_code=status.HTTP_200_OK,
    response_model=List[UserSchema])
def get_all_users(
	db = Depends(get_db)
):
    return Crud.user.get_all(db)

@router.get(
	"/{user_id}",
	status_code=status.HTTP_200_OK,
    response_model=UserSchema)
def get_user_by_id(
    user = Depends(get_user),
	db = Depends(get_db)
):
    return user

@router.post(
	"/create",
	status_code=status.HTTP_200_OK,
    response_model=UserSchema)
def get_all_users(
    user_to_create: UserCreate,
	db = Depends(get_db)
):
    return Crud.user.create(db, user_to_create)

# @router.post(
# 	"/edit/{user_id}",
# 	status_code=status.HTTP_200_OK,
#     response_model=UserSchema)
# def get_all_users(
#     user_to_create: UserCreate,
# 	db = Depends(get_db)
# ):
#     return Crud.user.create(db, user_to_create)