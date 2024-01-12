from typing import Optional, Any, List

from Enum.StatusEnum import StatusEnum

from .base import CRUDBase
from Model import Message
from Schemas.message import MessageCreate
from sqlalchemy.orm import Session, noload, selectinload
from pydantic import BaseModel
from sqlalchemy import select, update
from fastapi.encoders import jsonable_encoder
import datetime

class CRUDMessage(CRUDBase[Message, MessageCreate, MessageCreate]):

    def create(self, db, obj_in: MessageCreate, current_user, user) -> Message:
        obj_in_data = jsonable_encoder(obj_in)
        print(obj_in_data)
        obj_in_data['user_A_id'] = current_user.id
        obj_in_data['user_B_id'] = user.id

        
        db_obj = self.model(**obj_in_data, date=datetime.datetime.now())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


    def get_conversation(self, db: Session, user_A: Any, user_B: Any, **kwargs) -> List[Message]:
        return db.execute(
            select(self.model).where(
            ((self.model.user_A_id == user_A.id) & (self.model.user_B_id == user_B.id)) |
            ((self.model.user_A_id == user_B.id) & (self.model.user_B_id == user_A.id))
        ).order_by(self.model.date)
        ).scalars().all()


message = CRUDMessage(Message)
