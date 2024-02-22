import datetime
from fastapi_socketio import SocketManager
from fastapi import Depends

from Utils import get_db, logger
from Utils.App import app
import Crud
from Enum.StatusEnum import StatusEnum
from Schemas.user import UserUpdate

import asyncio
import time

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from Socket import disconnect_clients, connected_clients


engine = create_engine("mysql+pymysql://admin:admin@mysql-db/matcha")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionLocal()


socket_manager = SocketManager(app=app)

async def background_task():
    while True:
        for client in disconnect_clients:
            now = time.time()
            
            if now - client['time'] >= 5:
                user = Crud.user.get(db, client["user_id"])
                if user:
                    logger.info(f'{user.username} OFFLINE')
                disconnect_clients.remove(client)
                await socket_manager.emit('update-status', {"user_id": client["user_id"], "status": StatusEnum.OFFLINE.value})
        await asyncio.sleep(1)

asyncio.create_task(background_task())

@socket_manager.on('connect')
async def connect(sid, environ, auth):
    if not auth["user_id"]:
        return
    if not (user := Crud.user.get(db, auth["user_id"])):
        print('socket connect', user)
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
        user = Crud.user.get(db, auth["user_id"])
        print('socket connect 2', user)
        user_update = UserUpdate(last_connection_date=datetime.datetime.now())
        user = Crud.user.update(db, db_obj=user, obj_in=user_update)
        await socket_manager.emit('update-status', {"user_id": auth["user_id"], "status": StatusEnum.ONLINE.value})
        logger.info(f"{user.username} connected {sid}")

@socket_manager.on('disconnect')
async def disconnect(sid):
    for client in connected_clients:
        if client['sid'] == sid:
            disconnect_clients.append({"user_id": client["auth"]["user_id"], "time": time.time()})
            user = Crud.user.get(db, client["auth"]["user_id"])
            print('socket disconnect', user)
            connected_clients.remove(client)
            logger.info(f"{user.username} disconnected {sid}")
            break


