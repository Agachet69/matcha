# socket/socket.py

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
                user_update = UserUpdate(status=StatusEnum.OFFLINE)
                user = Crud.user.update(db, db_obj=user, obj_in=user_update)
                disconnect_clients.remove(client)
                await asyncio.sleep(.5)
                await socket_manager.emit('update-status', {"user_id": client["user_id"], "status": StatusEnum.OFFLINE.value})
        await asyncio.sleep(1)

asyncio.create_task(background_task())

@socket_manager.on('connect')
async def connect(sid, environ, auth):
    if not auth["user_id"]:
        return
    connected_clients.append({
        'sid': sid,
        'auth': auth, # {user_id: int}
    })
    
    db = SessionLocal()
    
    disconnect_client = next((client for client in disconnect_clients if client['user_id'] == auth['user_id']), None)
    
    if disconnect_client:
        disconnect_clients.remove(disconnect_client)
        logger.info(f"Client reconnected {sid}")
    else:
        logger.info("oui")
        user = Crud.user.get(db, auth["user_id"])
        user_update = UserUpdate(status=StatusEnum.ONLINE)
        user = Crud.user.update(db, db_obj=user, obj_in=user_update)
        await socket_manager.emit('update-status', {"user_id": auth["user_id"], "status": StatusEnum.ONLINE.value})
        logger.info(f"Client connected {sid}")

@socket_manager.on('disconnect')
async def disconnect(sid):
    for client in connected_clients:
        if client['sid'] == sid:
            disconnect_clients.append({"user_id": client["auth"]["user_id"], "time": time.time()})
            connected_clients.remove(client)
            break
    logger.info(f"Client disconnected {sid}")


