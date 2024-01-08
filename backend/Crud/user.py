from typing import Optional, List

from Schemas.notif import NotifCreate
from Enum.StatusEnum import StatusEnum
from Schemas.search import SearchSchema

from .base import CRUDBase
from Model import User, Notif, Like
from Schemas.user import UserCreate, UserUpdate

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.orm import Session, noload, selectinload
from math import radians, sin, cos, sqrt, atan2


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def create(self, db: Session, obj_in: UserCreate, **kwargs) -> User:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def search(self, db: Session, current_user: User, search_param: SearchSchema, **kwargs) -> List[User]:
        query = select(self.model).where(self.model.id != current_user.id)

        if age_limit := getattr(search_param, 'age_limit', None):
            if age_limit.min is not None and age_limit.max is not None:
                query = query.where(self.model.age >= age_limit.min, self.model.age <= age_limit.max)
        if fame_rate_limit := getattr(search_param, 'fame_rate_limit', None):
            if fame_rate_limit.min is not None and fame_rate_limit.max is not None:
                pass
                # query = query.where(self.model.age >= age_limit.min, self.model.age <= age_limit.max)
        if location_limit := getattr(search_param, 'location_limit', None):
            if location_limit.min is not None and location_limit.max is not None:

                haversine_formula = (
                    6371.0 * 2 * func.ASIN(
                        func.SQRT(
                            func.POWER(func.SIN(func.RADIANS(self.model.latitude - current_user.latitude) / 2), 2) +
                            func.COS(func.RADIANS(current_user.latitude)) * func.COS(func.RADIANS(self.model.latitude)) *
                            func.POWER(func.SIN(func.RADIANS(self.model.longitude - current_user.longitude) / 2), 2)
                        )
                    )
                )

                query = query.where(haversine_formula.between(location_limit.min, 100000 if location_limit.max == 500 else location_limit.max))

        result = db.execute(query).scalars().all()
        return result
    
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
