import datetime
from typing import List, Any
from Utils import get_db
from Schemas.token import TokenSchema
from Schemas.notif import NotifCreate
from Enum.NotifTypeEnum import NotifTypeEnum
from Schemas.like import LikeSchema
from Schemas.match import MatchCreate
from Schemas.search import SearchSchema
from fastapi import APIRouter, Depends, HTTPException, status
from Schemas.message import MessageSchema, MessageCreate
from Schemas.user import UserSchema
import Crud
from Deps.user import get_user, get_current_user
from Utils import security
from Socket import connected_clients, disconnect_clients
from fastapi.encoders import jsonable_encoder

router = APIRouter(prefix="/messages", tags=["Message"])





@router.get("/{user_id}", status_code=status.HTTP_200_OK, response_model=List[Any])
def get_conversation(
    current_user: UserSchema = Depends(get_current_user), user: UserSchema = Depends(get_user), db = Depends(get_db)
):
    messages = Crud.message.get_conversation(db, current_user, user)
    return messages

@router.post("/{user_id}", status_code=status.HTTP_200_OK, response_model=MessageSchema)
async def send_message(
    obj_in: MessageCreate,
    current_user: UserSchema = Depends(get_current_user), user: UserSchema = Depends(get_user),
    db = Depends(get_db),
):

    if not obj_in.data:
        raise HTTPException(status_code=400, detail="Message is required.")

    from Socket.socket import socket_manager
    
    
    notif_to_create = NotifCreate(
        data=f'{current_user.username} send you a message',
        data_user_id=current_user.id,
        type=NotifTypeEnum.MESSAGE
    )
    Crud.user.add_notif(db, user, notif_to_create)
    if client := next((client for client in connected_clients if client['auth']['user_id'] == user.id), None):
        await socket_manager.emit('update-messages', room=client["sid"])
        await socket_manager.emit('add-message-notification', {
            'notif_id': user.notifs[-1].id,
            'data_user_id': user.notifs[-1].data_user_id,
            'data': user.notifs[-1].data
        }, room=client["sid"])



    return Crud.message.create(db, obj_in, current_user, user)
