# backend/main.py

from typing import Any

from Utils import Base, get_db

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Sequence
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi_socketio import SocketManager
from Router import api_router
import logging

logger = logging.getLogger(__name__)

logger.setLevel(logging.DEBUG)

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(levelname)s:     %(message)s')
ch.setFormatter(formatter)

logger.addHandler(ch)

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace "*" with a list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # You can replace "*" with a list of allowed HTTP methods
    allow_headers=["*"],  # You can replace "*" with a list of allowed HTTP headers
)

app.include_router(api_router)

socket_manager = SocketManager(app=app)

connected_clients = []

@app.sio.event
async def connect(sid, environ, auth):
    connected_clients.append({
        'sid': sid,
        'auth': auth,
    })
    logger.info(f"Client connected {sid}")
    logger.info(connected_clients)

@app.sio.event
async def disconnect(sid):
    for client in connected_clients:
        if client['sid'] == sid:
            connected_clients.remove(client)
            break
    logger.info(f"Client disconnected {sid}")
    logger.info(connected_clients)

@socket_manager.on('register')
async def handle_leave(sid, data):
    logger.info(f"Hello: {data}")