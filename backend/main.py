import time
from typing import Any

from Utils import Base

from Router import api_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi_socketio import SocketManager
from fastapi.staticfiles import StaticFiles
from Router import api_router
import os

load_dotenv()

from Utils.App import app
from Socket.socket import socket_manager

uploads_directory = "uploads"

if not os.path.exists(uploads_directory):
    os.makedirs(uploads_directory)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

socket_manager = SocketManager(app=app)


@app.sio.event
async def connect(sid, environ, auth):
    logger.info(f"Client connected {sid}")
    
@app.sio.event
async def disconnect(sid):
    logger.info(f"Client disconnected {sid}")

@socket_manager.on('hello')
async def handle_leave(sid, data):
    logger.info(f"Hello: {data}")
