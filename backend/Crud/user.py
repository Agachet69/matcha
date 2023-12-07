from typing import Optional

from Schemas.notif import NotifCreate

from .base import CRUDBase
from Model import User, Notif
from Schemas.user import UserCreate, UserUpdate

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select, update
from sqlalchemy.orm import Session, noload

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def add_notif(self, db: Session, db_obj: User, notif: NotifCreate):
        print(notif.type)
        db_obj.notifs.append(Notif(type=notif.type.value, data=notif.data, user_id=db_obj.id))
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        return db_obj


user = CRUDUser(User)
