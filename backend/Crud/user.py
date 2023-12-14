from typing import Optional, List

from Schemas.notif import NotifCreate
from Enum.StatusEnum import StatusEnum

from .base import CRUDBase
from Model import User, Notif, Like
from Schemas.user import UserCreate, UserUpdate

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session, noload, selectinload

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def create(self, db: Session, obj_in: UserCreate, **kwargs) -> User:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, status=StatusEnum.OFFLINE)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def like(self, db: Session, user_from: User, user_target: User):
        like_obj = Like(
            user_id = user_from.id,
            user_target_id = user_target.id,
        )
        db.add(like_obj)
        db.commit()
        db.refresh(like_obj)
        
        db.refresh(user_from)
        return user_from

    def add_notif(self, db: Session, db_obj: User, notif: NotifCreate):
        db_obj.notifs.append(
            Notif(type=notif.type.value, data=notif.data, data_user_id=notif.data_user_id, user_id=db_obj.id)
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


user = CRUDUser(User)
