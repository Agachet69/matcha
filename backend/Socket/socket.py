# socket/socket.py

import datetime
from fastapi_socketio import SocketManager
from fastapi import Depends

from Utils import SessionLocal, logger
from Utils.App import app
import Crud
from Enum.StatusEnum import StatusEnum
from Schemas.user import UserUpdate

import asyncio
import time

from Socket import disconnect_clients, connected_clients




socket_manager = SocketManager(app=app)

async def background_task():
    db = SessionLocal()
    while True:
        for client in disconnect_clients:
            now = time.time()
            
            if now - client['time'] >= 5:
                user = Crud.user.get(db, client["user_id"])
                logger.info(f'{user.username} OFFLINE')
                # user_update = UserUpdate(status=StatusEnum.OFFLINE)
                # await asyncio.sleep(.5)
                # logger.info(user_update)
                # user = Crud.user.update(db, db_obj=user, obj_in=user_update)
                disconnect_clients.remove(client)
                await socket_manager.emit('update-status', {"user_id": client["user_id"], "status": StatusEnum.OFFLINE.value})
        await asyncio.sleep(1)

asyncio.create_task(background_task())

@socket_manager.on('connect')
async def connect(sid, environ, auth):
    if not auth["user_id"]:
        return
    db = SessionLocal()
    if not (user := Crud.user.get(db, auth["user_id"])):
        return
    
    connected_clients.append({
        'sid': sid,
        'auth': auth, # {user_id: int}
    })
    
    
    disconnect_client = next((client for client in disconnect_clients if client['user_id'] == auth['user_id']), None)
    
    if disconnect_client:
        disconnect_clients.remove(disconnect_client)
        logger.info(f"{user.username} reconnected {sid}")
    else:
        logger.info("oui")
        user = Crud.user.get(db, auth["user_id"])
        user_update = UserUpdate(last_connection_date=datetime.datetime.now())
        user = Crud.user.update(db, db_obj=user, obj_in=user_update)
        await socket_manager.emit('update-status', {"user_id": auth["user_id"], "status": StatusEnum.ONLINE.value})
        logger.info(f"{user.username} connected {sid}")

@socket_manager.on('disconnect')
async def disconnect(sid):
    for client in connected_clients:
        if client['sid'] == sid:
            db = SessionLocal()
            disconnect_clients.append({"user_id": client["auth"]["user_id"], "time": time.time()})
            user = Crud.user.get(db, client["auth"]["user_id"])
            connected_clients.remove(client)
            logger.info(f"{user.username} disconnected {sid}")
            break


