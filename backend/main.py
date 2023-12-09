# backend/main.py

import time
from typing import Any

from Utils import Base

from Router import api_router
from Enum.StatusEnum import StatusEnum
from Schemas.user import UserUpdate
from create_database import SessionLocal

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Sequence
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi_socketio import SocketManager
import asyncio
import logging
import Crud

load_dotenv()

from Utils.App import app
from Socket.socket import socket_manager

