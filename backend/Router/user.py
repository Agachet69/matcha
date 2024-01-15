import datetime
from typing import List
from Utils import get_db
from Schemas.token import TokenSchema
from Enum.StatusEnum import StatusEnum
from Schemas.notif import NotifCreate
from Enum.NotifTypeEnum import NotifTypeEnum
from Schemas.like import LikeSchema
from Schemas.match import MatchCreate
from Schemas.search import SearchSchema
from fastapi import APIRouter, Depends, HTTPException, status
from Schemas.user import UserLogin, UserSchema, UserCreate, UserUpdate
from Schemas.tag import TagCreate
import Crud
from Deps.user import get_user, get_current_user
from Utils import security
import uuid
from pathlib import Path as PathLib
from sqlalchemy.orm import Session
from Socket import connected_clients, disconnect_clients
from fastapi.encoders import jsonable_encoder

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[UserSchema])
def get_all_users(
    current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)
):
    user_list = Crud.user.get_all(db)
    
    id_arr = [client["auth"]["user_id"] for client in connected_clients] + [client["user_id"] for client in disconnect_clients]
    status_dict = {}
    for user in user_list:
        if user.id in id_arr:
            status_dict[user.id] = "ONLINE"
        else:
            status_dict[user.id] = "OFFLINE"
    
    for user in user_list:
        user.status = status_dict.get(user.id, "UNKNOWN")

    return user_list

@router.post("/register", status_code=status.HTTP_200_OK, response_model=TokenSchema)
def register(user_to_create: UserCreate, db=Depends(get_db)):
    if user := Crud.user.get_from_key(db, "username", user_to_create.username):
        raise HTTPException(status_code=400, detail="username already taken.")

    user_to_create.password = security.hash_password(user_to_create.password)
    user_to_create.last_connection_date = datetime.datetime.now()
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
        raise HTTPException(status_code=404, detail="Password incorrect")
    
    user_update = UserUpdate(last_connection_date=datetime.datetime.now())

    Crud.user.update(db, db_obj=user, obj_in=user_update)
    return {
        "access_token": security.create_jwt_token(
            {"username": user.username, "password": user.password}
        ),
        "token_type": "bearer",
    }
    
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

@router.get("/{user_id}", status_code=status.HTTP_200_OK, response_model=UserSchema)
def get_one_user(
    current_user: UserSchema = Depends(get_current_user), user: UserSchema = Depends(get_user)
):
    id_arr = [client["auth"]["user_id"] for client in connected_clients] + [client["user_id"] for client in disconnect_clients]
    if user.id in id_arr:
        user.status = 'ONLINE'
    else:
        user.status = 'OFFLINE'
    return user

@router.post("/search", status_code=status.HTTP_200_OK, response_model=List[UserSchema])
async def search(
    search_params: SearchSchema,
    current_user: UserSchema = Depends(get_current_user),
    db=Depends(get_db)
):
    user_list = Crud.user.search(db, current_user, search_params)
    
    id_arr = [client["auth"]["user_id"] for client in connected_clients] + [client["user_id"] for client in disconnect_clients]
    status_dict = {}
    for user in user_list:
        if user.id in id_arr:
            status_dict[user.id] = "ONLINE"
        else:
            status_dict[user.id] = "OFFLINE"
    
    for user in user_list:
        user.status = status_dict.get(user.id, "UNKNOWN")

    return user_list

@router.post("/like/{user_id}", status_code=status.HTTP_200_OK, response_model=UserSchema)
async def like(
    current_user: UserSchema = Depends(get_current_user), user_to_like: UserSchema = Depends(get_user), db=Depends(get_db)
):
    from Socket.socket import socket_manager
    
    
    user_match = next((user_match for user_match in current_user.matches if user_match.user_A_id == user_to_like.id or user_match.user_B_id == user_to_like.id), None)
    if user_match != None:
        Crud.match.remove(db, id=user_match.id)
        db.refresh(current_user)
        
        notif_to_create = NotifCreate(
            data=f'{current_user.username} has un-match you.',
            data_user_id=current_user.id,
            type=NotifTypeEnum.LIKE
        )
        user = Crud.user.add_notif(db, user_to_like, notif_to_create)
        if client := next((client for client in connected_clients if client['auth']['user_id'] == user_to_like.id), None):
            await socket_manager.emit('add-notification', {
                'data': user.notifs[-1].data,
                'data_user_id': user.notifs[-1].data_user_id,
                'type': user.notifs[-1].type.value
            }, room=client["sid"])
        
        return current_user
    
    # IF CURRENT USER ALREADY LIKE THE USER_TO_LIKE -> REMOVE LIKE
    like = next((like for like in current_user.likes if like.user_target_id == user_to_like.id), None)
    if like != None:
        Crud.like.remove(db, id=like.id)
        db.refresh(current_user)
        notif_to_create = NotifCreate(
            data=f'{current_user.username} has no longer a crush on you.',
            data_user_id=current_user.id,
            type=NotifTypeEnum.LIKE
        )
        user = Crud.user.add_notif(db, user_to_like, notif_to_create)
        if client := next((client for client in connected_clients if client['auth']['user_id'] == user_to_like.id), None):
            await socket_manager.emit('add-notification', {
                'data': user.notifs[-1].data,
                'data_user_id': user.notifs[-1].data_user_id,
                'type': user.notifs[-1].type.value
            }, room=client["sid"])
        return current_user
    
    # IF USER_TO_LIKE ALREADY LIKE THE CURRENT_USER -> REMOVE LIKE + ADD MATCH
    like_target = next((like for like in user_to_like.likes if like.user_target_id == current_user.id), None)
    if like_target != None:
        Crud.like.remove(db, id=like_target.id)
        Crud.match.create(db, MatchCreate(**{
            "user_A_id": current_user.id,
            "user_B_id": user_to_like.id,
        }))
        notif_to_create = NotifCreate(
            data=f"""It's a MATCH !""",
            data_user_id=current_user.id,
            type=NotifTypeEnum.MATCH
        )
        user = Crud.user.add_notif(db, user_to_like, notif_to_create)
        if client := next((client for client in connected_clients if client['auth']['user_id'] == user_to_like.id), None):
            await socket_manager.emit('add-notification', {
                'data': user.notifs[-1].data,
                'data_user_id': user.notifs[-1].data_user_id,
                'type': user.notifs[-1].type.value
            }, room=client["sid"])
        db.refresh(current_user)
        return current_user
    
    # IF NO USER HAS LIKE
    current_user = Crud.user.like(db, current_user, user_to_like)
    notif_to_create = NotifCreate(
        data=f'{current_user.username} has a crush on you.',
        data_user_id=current_user.id,
        type=NotifTypeEnum.LIKE
    )
    user = Crud.user.add_notif(db, user_to_like, notif_to_create)
    if client := next((client for client in connected_clients if client['auth']['user_id'] == user_to_like.id), None):
        await socket_manager.emit('add-notification', {
            'data': user.notifs[-1].data,
            'data_user_id': user.notifs[-1].data_user_id,
            'type': user.notifs[-1].type.value
        }, room=client["sid"])

    return current_user

@router.post("del_notif/{notif_id}")
def del_notif(notid_id: int, current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)):
    if notif_id not in (notif.id for notif in current_user.notifs):
        raise HTTPException(status_code=404, detail="Notification not found")
    return Crud.user.delete_notif(db, current_user, notif_id)


# @router.get("/add_notif", status_code=status.HTTP_200_OK, response_model=UserSchema)
# def get_me(current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)):
#     notif = NotifCreate(type=NotifTypeEnum.ERROR, data="Error")
#     return Crud.user.add_notif(db, current_user, notif)
