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
from Enum.SexualityEnum import SexualityEnum
from Enum.GenderEnum import GenderEnum
from Model import Tag


class CRUDUser():
    
    def fetch_related_objects(self, db_connection, user, model):
        try:
            with db_connection.connection().connection.cursor() as cursor:
                # Check if model is Tag and handle the many-to-many relationship
                if model == Tag:
                    sql = f"SELECT * FROM `tags` WHERE `id` IN (SELECT `tag_id` FROM `user_tag_association` WHERE `user_id` = %s)"
                    cursor.execute(sql, (user.id,))
                else:
                    # Fetch related objects based on user's id
                    sql = f"SELECT * FROM `{model.__tablename__}` WHERE `user_id` = %s"
                    cursor.execute(sql, (user.id,))
                    
                results = cursor.fetchall()
                related_objects = [model(**result) for result in results]
                return related_objects
        except Exception as e:
            print(f"Error while fetching related objects: {e}")
            return []
    
    def get(self, db, id: int, **kwargs):
        try:
            with db.connection().connection.cursor() as cursor:
                sql = "SELECT * FROM `users` WHERE `id` = %s"
                cursor.execute(sql, (id,))
                result = cursor.fetchone()
                user = User(
                                id=result[0],
                                username=result[1],
                                lastName=result[2],
                                firstName=result[3],
                                email=result[4],
                                gender=result[5],
                                sexuality=result[6],
                                age=result[7],
                                bio=result[8],
                                last_connection_date=result[9],
                                latitude=result[10],
                                longitude=result[11],
                                fame_rate=result[12],
                                email_check=result[13],
                                verification_code=result[14],
                                password=result[15],
                            )
                return user
        except Exception as e:
            print(f"Error while fetching user: {e}")
            return None

    def get_from_key(self, db, key: str, key_value):
        try:
            with db.connection().connection.cursor() as cursor:
                # Read a single record based on the key-value pair
                sql = f"SELECT * FROM `users` WHERE `{key}` = %s"
                cursor.execute(sql, (key_value,))
                result = cursor.fetchone()
                if result:
                    print(result)
                    user = User(
                                id=result[0],
                                username=result[1],
                                lastName=result[2],
                                firstName=result[3],
                                email=result[4],
                                gender=result[5],
                                sexuality=result[6],
                                age=result[7],
                                bio=result[8],
                                last_connection_date=result[9],
                                latitude=result[10],
                                longitude=result[11],
                                fame_rate=result[12],
                                email_check=result[13],
                                verification_code=result[14],
                                password=result[15],
                            )
                    
                    # Fetch related objects
                    user.tags = self.fetch_related_objects(db, user, Tag)
                    user.photos = self.fetch_related_objects(db, user, Photo)
                    user.notifs = self.fetch_related_objects(db, user, Notif)
                    # Add other related objects similarly
                    print(user.password)
                    return user
                else:
                    return None
        except Exception as e:
            print(f"Error while fetching data: {e}")
            return None

    def get_all(self, db, **kwargs):
        # db_connector = next(db)
        try:
            with db.cursor() as cursor:
                sql = "SELECT * FROM `users`"
                cursor.execute(sql)
                results = cursor.fetchall()
                return [User(**result) for result in results]
        except Exception as e:
            print(f"Error while fetching users: {e}")
            return None

    def update(self, db, db_obj, obj_in: UserUpdate):
        # db_connector = next(db)
        try:
            with db.connection().connection.cursor() as cursor:
                # Construct the UPDATE query
                sql = "UPDATE `users` SET "
                print(obj_in.dict())
                print(len([field for field, value in obj_in.dict().items() if value is not None]))
                for field, value in obj_in.dict().items():
                    if value is not None:
                        sql += f"`{field}` = %s, "
                sql = sql[:-2]  # Remove the trailing comma and space
                sql += " WHERE `id` = %s"

                # Extract values from the obj_in object
                values = [obj_in.dict()[field] for field in obj_in.dict() if obj_in.dict()[field] is not None]
                print('values', len(values))
                print('sql', sql)
                values = [(value if not isinstance(value, GenderEnum) and not isinstance(value, SexualityEnum) else value.value) for value in values]
                print('values', values)
                values.append(db_obj.id)

                # Execute the query
                cursor.execute(sql, tuple(values))

                # Commit the changes
                db.commit()
                sql = "SELECT * FROM `users` WHERE `id` = %s"
                cursor.execute(sql, (db_obj.id,))
                result = cursor.fetchone()
                user = User(
                                id=result[0],
                                username=result[1],
                                lastName=result[2],
                                firstName=result[3],
                                email=result[4],
                                gender=result[5],
                                sexuality=result[6],
                                age=result[7],
                                bio=result[8],
                                last_connection_date=result[9],
                                latitude=result[10],
                                longitude=result[11],
                                fame_rate=result[12],
                                email_check=result[13],
                                verification_code=result[14],
                                password=result[15],
                            )
                return user
        except Exception as e:
            print(f"Error while updating user: {e}")
        return False

    def remove(self, db: Session, *, id: int):
        obj = (
            db.execute(select(self.model).where(self.model.id == id)).scalars().first()
        )
        db.delete(obj)
        db.commit()
        return obj
    
    def create(self, db: Session, obj_in: UserCreate, verification_code: str, **kwargs) -> User:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, verification_code=verification_code)
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
            .filter(User.photos.any(Photo.main.is_(True)))
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


        query = query.where(~or_(
            User.id.in_([like.user_target_id for like in current_user.likes]),
            User.id.in_([match.user_A_id if match.user_A_id != current_user.id else match.user_B_id for match in current_user.matches])
        ))
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

user = CRUDUser()
