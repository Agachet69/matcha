from typing import Optional, List

from Schemas.notif import NotifCreate
from Enum.StatusEnum import StatusEnum
from Schemas.search import SearchSchema

from .base import CRUDBase
from Model import User, Notif, Like, Block, Photo, ProfileSeen, LikePhoto
from Schemas.user import UserCreate, UserUpdate
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session, noload, selectinload, aliased
from math import radians, sin, cos, sqrt, atan2
from Enum.SexualityEnum import SexualityEnum
from Enum.GenderEnum import GenderEnum
from Model import Tag


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def create(self, db: Session, obj_in: UserCreate, **kwargs) -> User:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def search(self, db: Session, current_user: User, search_param: SearchSchema, **kwargs) -> List[User]:
        query = (
            select(self.model)
            .where(self.model.id != current_user.id)
            .filter(~User.id.in_([block.user_target_id for block in current_user.blocked]))
            .filter(~User.id.in_([block.user_id for block in current_user.blocked_by]))
            # .filter(User.photos.any(Photo.main.is_(True)))
        )

        if age_limit := getattr(search_param, 'age_limit', None):
            if age_limit.min is not None and age_limit.max is not None:
                query = query.where(self.model.age >= age_limit.min, self.model.age <= age_limit.max)
        if fame_rate_limit := getattr(search_param, 'fame_rate_limit', None):
            if fame_rate_limit.min is not None and fame_rate_limit.max is not None:
                query = query.where(self.model.fame_rate >= fame_rate_limit.min, self.model.fame_rate <= fame_rate_limit.max)
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
        if tags := getattr(search_param, 'tags', None):
            query = query.where(self.model.tags.any(Tag.tag.in_(tags)))

        if current_user.sexuality == SexualityEnum.HETEROSEXUAL:
            query = query.where(self.model.gender == (GenderEnum.MALE if current_user.gender == GenderEnum.FEMALE else GenderEnum.FEMALE))
        elif current_user.sexuality == SexualityEnum.HOMOSEXUAL:
            query = query.where(self.model.gender == (GenderEnum.MALE if current_user.gender == GenderEnum.MALE else GenderEnum.FEMALE))


        # query = query.where(~or_(
            # User.id.in_([like.user_target_id for like in current_user.likes]),
            # User.id.in_([match.user_A_id if match.user_A_id != current_user.id else match.user_B_id for match in current_user.matches])
        # ))
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

    def delete_notif(self, db: Session, db_obj: User, notif_to_delete):
        db_obj.notifs.remove(notif_to_delete)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def add_block(self, db: Session, user: User, user_target: User):
        block = Block(user_id=user.id, user_target_id=user_target.id)
        db.add(block)
        db.commit()

    def remove_block(self, db: Session, user: User, user_target: User):
        db.query(Block).filter(Block.user_id == user.id, Block.user_target_id == user_target.id).delete()
        db.commit()
        
    def add_like_photo(self, db: Session, user: User, photo: Photo):
        block = LikePhoto(user_id=user.id, photo_id=photo.id)
        db.add(block)
        db.commit()

    def remove_like_photo(self, db: Session, user: User, photo: Photo):
        db.query(LikePhoto).filter(LikePhoto.user_id == user.id, LikePhoto.photo_id == photo.id).delete()
        db.commit()

    def add_seen(self, db: Session, user: User, user_target: User):
        profile_seen = ProfileSeen(user_id=user.id, user_target_id=user_target.id)
        db.add(profile_seen)
        db.commit()

user = CRUDUser(User)
