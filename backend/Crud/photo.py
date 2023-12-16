from typing import Optional
from Schemas.notif import NotifCreate
from .base import CRUDBase
from Model import User, Notif, Photo
from Schemas.user import UserCreate, UserUpdate
from Schemas.photo import PhotoBase, PhotoCreate, PhotoUpdate

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select, update
from sqlalchemy.orm import Session, noload

class CRUDPhoto(CRUDBase[Photo, PhotoCreate, PhotoUpdate]):
  
  # def get_all_user_photos
  pass

photo = CRUDPhoto(Photo)