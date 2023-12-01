from typing import Optional

from .base import CRUDBase
from Model import User, Notif
from Schemas.user import UserCreate, UserUpdate

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select, update
from sqlalchemy.orm import Session, noload

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def add_notif(self, db: Session, db_obj: User):
        db_obj.notifs.append(Notif(**{
            "user_id":db_obj.id,
            "data":"",
        }))
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        return db_obj


user = CRUDUser(User)
