from typing import List
from Utils import get_db
from Schemas.token import TokenSchema
from Enum.StatusEnum import StatusEnum
from Schemas.notif import NotifCreate
from Enum.NotifTypeEnum import NotifTypeEnum
from fastapi import APIRouter, Depends, HTTPException, status
from Schemas.user import UserLogin, UserSchema, UserCreate, UserUpdate
import Crud
from Deps.user import get_user, get_current_user
from Utils import security
from Socket import connected_clients


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


@router.post("/like/{user_id}", status_code=status.HTTP_200_OK, response_model=UserSchema)
async def get_me(
    current_user: UserSchema = Depends(get_current_user), user_to_like=Depends(get_user)
):
    from Socket.socket import socket_manager
    from Utils.App import app
    
    # await socket_manager.emit('update-status', {'data': 'foobar'}, room=connected_clients[0]["sid"])

    
    print(connected_clients)
    # socket_manager

    
    print(user_to_like)
    
    # return current_user

# @router.get("/add_notif", status_code=status.HTTP_200_OK, response_model=UserSchema)
# def get_me(current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)):
#     notif = NotifCreate(type=NotifTypeEnum.ERROR, data="Error")
#     return Crud.user.add_notif(db, current_user, notif)
