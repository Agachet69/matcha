from cmath import asin, cos, sin, sqrt
from math import radians, pow
from typing import Optional, List

from Schemas.notif import NotifCreate
from Enum.StatusEnum import StatusEnum
from Schemas.search import SearchSchema

from .base import CRUDBase
from Model import User, Notif, Like, Block, Photo, ProfileSeen, LikePhoto, Tag, Match
from Schemas.user import UserCreate, UserUpdate
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session, noload, selectinload, aliased
from Enum.SexualityEnum import SexualityEnum
from Enum.GenderEnum import GenderEnum
import datetime
from fastapi import HTTPException


class CRUDUser():
    
    def fetch_related_objects(self, db_connection, user_id, model, for_match=None) -> List:
        try:
            with db_connection.connection().connection.cursor() as cursor:
                if model == Match:
                    sql = f"SELECT * FROM matches WHERE ( user_A_id = '{user_id}' OR user_B_id = '{user_id}')"
                    cursor.execute(sql )
                    results = cursor.fetchall()

                    return [Match(id=match[0], user_A_id=match[1], user_B_id=match[2]) for match in results]
                else:
                    sql = f"SELECT * FROM `{model.__tablename__}` WHERE `user_id` = %s"
                    cursor.execute(sql, (user_id,))
                    
                results = cursor.fetchall()

                column_names = model.__table__.columns.keys()

                related_objects = [model(**dict(zip(column_names, result))) for result in results]
                return related_objects
        except Exception as e:
            print(f"Error while fetching related objects ({model.__tablename__}): {e}")
            return []
    
    def fetch_related_target_objects(self, db_connection, user_id, model):
        try:
            with db_connection.connection().connection.cursor() as cursor:

                sql = f"SELECT * FROM `{model.__tablename__}` WHERE `user_target_id` = %s"
                cursor.execute(sql, (user_id,))
                
                results = cursor.fetchall()

                column_names = model.__table__.columns.keys()

                related_objects = [model(**dict(zip(column_names, result))) for result in results]
                return related_objects
        except Exception as e:
            print(f"Error while fetching related objects: {e}")
            return [] 
    
    def get(self, db, id: int, no_relation = False, with_tags = False):
        try:
            with db.connection().connection.cursor() as cursor:
                sql = "SELECT * FROM `users` WHERE `id` = %s"
                cursor.execute(sql, (id,))
                result = cursor.fetchone()
                if result:
                    user = User(**dict(zip(User.__table__.columns.keys(), result)))
                    
                    if not no_relation:
                        user.tags = self.fetch_related_objects(db, user.id, Tag)
                        user.photos = self.fetch_related_objects(db, user.id, Photo)
                        
                        user.notifs = self.fetch_related_objects(db, user.id, Notif)
                        
                        user.blocked = self.fetch_related_objects(db, user.id, Block)
                        for block in user.blocked:
                            block.user_target = self.get(db, block.user_target_id, no_relation=True)
                            block.user_target.photos = self.fetch_related_objects(db, block.user_target.id, Photo)
                            
                        user.blocked = self.fetch_related_objects(db, user.id, Block)
                        for block in user.blocked:
                            block.user_target = self.get(db, block.user_target_id, no_relation=True)
                            block.user_target.photos = self.fetch_related_objects(db, block.user_target.id, Photo)
                        
                        user.blocked_by = self.fetch_related_target_objects(db, user.id, Block)
                        for block in user.blocked_by:
                            block.user = self.get(db, block.user_id, no_relation=True)
                            block.user.photos = self.fetch_related_objects(db, block.user.id, Photo)
                        
                        user.like_photos = self.fetch_related_objects(db, user.id, LikePhoto)
                        
                        user.likes = self.fetch_related_objects(db, user.id, Like)
                        for like in user.likes:
                            like.user_target = self.get(db, like.user_target_id, no_relation=True)
                            like.user_target.photos = self.fetch_related_objects(db, like.user_target.id, Photo)
                        
                        user.liked_by = self.fetch_related_target_objects(db, user.id, Like)
                        for like in user.liked_by:
                            like.user = self.get(db, like.user_id, no_relation=True)
                            like.user.photos = self.fetch_related_objects(db, like.user.id, Photo)
                        
                        matches = self.fetch_related_objects(db, user.id, Match)

                        for match in matches:
                            if match.user_A_id == user.id:
                                match.user_B = self.get(db, match.user_B_id, True)
                            if match.user_B_id == user.id:
                                match.user_A = self.get(db, match.user_A_id, True)
                        
                        setattr(user, 'matches', matches)
                        
                        user.profile_seen = self.fetch_related_objects(db, user.id, ProfileSeen)
                        for seen in user.profile_seen:
                            seen.user_target = self.get(db, seen.user_target_id, no_relation=True)
                            seen.user_target.photos = self.fetch_related_objects(db, seen.user_target.id, Photo)
                        
                        user.profile_seen_by = self.fetch_related_target_objects(db, user.id, ProfileSeen)
                        for seen in user.profile_seen_by:
                            seen.user = self.get(db, seen.user_id, no_relation=True)
                            seen.user.photos = self.fetch_related_objects(db, seen.user.id, Photo)
                    return user
                else:
                    return  None
                
        except Exception as e:
            print(f"Error while fetching user: {e}")
            return None

    def get_from_key(self, db, key: str, key_value):
        try:
            with db.connection().connection.cursor() as cursor:
                sql = f"SELECT * FROM `users` WHERE `{key}` = %s"
                cursor.execute(sql, (key_value,))
                result = cursor.fetchone()
                if result:
                    user = User(**dict(zip(User.__table__.columns.keys(), result)))

                    user.tags = self.fetch_related_objects(db, user.id, Tag)
                    user.photos = self.fetch_related_objects(db, user.id, Photo)
                    
                    user.notifs = self.fetch_related_objects(db, user.id, Notif)
                    
                    user.blocked = self.fetch_related_objects(db, user.id, Block)
                    for block in user.blocked:
                        block.user_target = self.get(db, block.user_target_id, no_relation=True)
                        block.user_target.photos = self.fetch_related_objects(db, block.user_target.id, Photo)
                    
                    user.blocked_by = self.fetch_related_target_objects(db, user.id, Block)
                    for block in user.blocked_by:
                        block.user = self.get(db, block.user_id, no_relation=True)
                        block.user.photos = self.fetch_related_objects(db, block.user.id, Photo)
                    
                    user.like_photos = self.fetch_related_objects(db, user.id, LikePhoto)
                    
                    user.likes = self.fetch_related_objects(db, user.id, Like)
                    for like in user.likes:
                        like.user_target = self.get(db, like.user_target_id, no_relation=True)
                        like.user_target.photos = self.fetch_related_objects(db, like.user_target.id, Photo)
                    
                    user.liked_by = self.fetch_related_target_objects(db, user.id, Like)
                    for like in user.liked_by:
                        like.user = self.get(db, like.user_id, no_relation=True)
                        like.user.photos = self.fetch_related_objects(db, like.user.id, Photo)
                    
                    matches = self.fetch_related_objects(db, user.id, Match)

                    for match in matches:
                        if match.user_A_id == user.id:
                            match.user_B = self.get(db, match.user_B_id, True)
                            match.user_B.photos = self.fetch_related_objects(db, match.user_B.id, Photo)
                        if match.user_B_id == user.id:
                            match.user_A = self.get(db, match.user_A_id, True)
                            match.user_A.photos = self.fetch_related_objects(db, match.user_A.id, Photo)
                    
                    setattr(user, 'matches', matches)
                    
                    user.profile_seen = self.fetch_related_objects(db, user.id, ProfileSeen)
                    for seen in user.profile_seen:
                        seen.user_target = self.get(db, seen.user_target_id, no_relation=True)
                        seen.user_target.photos = self.fetch_related_objects(db, seen.user_target.id, Photo)
                    
                    user.profile_seen_by = self.fetch_related_target_objects(db, user.id, ProfileSeen)
                    for seen in user.profile_seen_by:
                        seen.user = self.get(db, seen.user_id, no_relation=True)
                        seen.user.photos = self.fetch_related_objects(db, seen.user.id, Photo)
                    return user
                else:
                    return None
        except Exception as e:
            print(f"Error while fetching data: {e}")
            return None

    def get_all(self, db, **kwargs):
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
        try:
            with db.connection().connection.cursor() as cursor:
                sql = "UPDATE `users` SET "
                for field, value in obj_in.dict().items():
                    if value is not None:
                        sql += f"`{field}` = %s, "
                sql = sql[:-2]
                sql += " WHERE `id` = %s"

                values = [obj_in.dict()[field] for field in obj_in.dict() if obj_in.dict()[field] is not None]
                values = [(value if not isinstance(value, GenderEnum) and not isinstance(value, SexualityEnum) else value.value) for value in values]
                values.append(db_obj.id)

                cursor.execute(sql, tuple(values))

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
        try:
            with db.connection().connection.cursor() as cursor:

                sql = f'''INSERT INTO users (username, lastName, firstName, email, gender, sexuality, 
                    age, bio, password, latitude, longitude, fame_rate, last_connection_date, email_check, verification_code) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''

                cursor.execute(sql, (obj_in.username, obj_in.lastName, obj_in.firstName, obj_in.email,
                    obj_in.gender.value, obj_in.sexuality.value, obj_in.age, obj_in.bio,
                    obj_in.password, obj_in.latitude, obj_in.longitude, '0',
                    datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), '0', verification_code))

                db.commit()
                return obj_in
        except Exception as e:
            print(f"Error while creating user: {e}")
        return False
    
    def search(self, db: Session, current_user: User, search_param: SearchSchema, **kwargs) -> List[User]:
        sql = f'''SELECT *
                    FROM users
                        WHERE users.id != "{current_user.id}"
                            AND users.id NOT IN (
                                SELECT user_target_id
                                FROM blocks
                                WHERE blocks.user_id = "{current_user.id}"
                            )
                            AND users.id NOT IN (
                                SELECT user_id
                                FROM blocks
                                WHERE blocks.user_target_id = "{current_user.id}"
                            )
                            AND users.id NOT IN (
                                SELECT user_A_id
                                FROM matches
                                WHERE matches.user_B_id = "{current_user.id}"
                            )
                            AND users.id NOT IN (
                                SELECT user_B_id
                                FROM matches
                                WHERE matches.user_A_id = "{current_user.id}"
                            )
                            AND users.id NOT IN (
                                SELECT user_target_id
                                FROM likes
                                WHERE likes.user_id = "{current_user.id}"
                            )
                            AND EXISTS (
                                SELECT 1
                                FROM photos
                                WHERE photos.user_id = users.id
                                    AND photos.main = true
                            )
                            '''
                            
                            
        if age_limit := getattr(search_param, 'age_limit', None):
            if age_limit.min is not None and age_limit.max is not None:
                sql += f" AND users.age >= {age_limit.min} AND users.age <= {age_limit.max}"

        if fame_rate_limit := getattr(search_param, 'fame_rate_limit', None):
            if fame_rate_limit.min is not None and fame_rate_limit.max is not None:
                sql += f" AND users.fame_rate >= {fame_rate_limit.min} AND users.fame_rate <= {fame_rate_limit.max}"

        if location_limit := getattr(search_param, 'location_limit', None):
            if location_limit.min is not None and location_limit.max is not None:
                sql += f""" AND ( 6371.0 * 2 * ASIN(
                 SQRT(
                     POWER(SIN(RADIANS(users.latitude - {current_user.latitude}) / 2), 2) +
                     COS(RADIANS({current_user.latitude})) * COS(RADIANS(users.latitude)) *
                     POWER(SIN(RADIANS(users.longitude - {current_user.longitude}) / 2), 2)
                 )
             ) BETWEEN {location_limit.min} AND {100000 if location_limit.max == 500 else location_limit.max})"""
        
        if tags := getattr(search_param, 'tags', None):
            tags_conditions = ' OR '.join([f"tags.tag = '{tag.value}'" for tag in tags])
            sql += f''' AND users.id IN (
                        SELECT user_id
                        FROM tags
                        WHERE {tags_conditions}
              )'''

        if current_user.sexuality == SexualityEnum.HETEROSEXUAL.value:
            sql += f' AND users.gender = "{GenderEnum.FEMALE.value if current_user.gender == GenderEnum.MALE.value else GenderEnum.MALE.value}" '
        elif current_user.sexuality == SexualityEnum.HOMOSEXUAL.value:
            sql += f'AND users.gender = "{GenderEnum.FEMALE.value if current_user.gender == GenderEnum.FEMALE.value else GenderEnum.MALE.value}" '

        sql += ";"
        
        try:
            with db.connection().connection.cursor() as cursor:

                cursor.execute(sql)

                results = cursor.fetchall()
                
                users = [User(**dict(zip(User.__table__.columns.keys(), result))) for result in results]
                users = [self.get(db, user.id, with_tags=True) for user in users]

                return users
        except Exception as e:
            print(f"Error while searching users: {e}")
        return False

    def like(self, db: Session, user_from: User, user_target: User):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = 'INSERT INTO likes (user_id, user_target_id) VALUES (%s, %s) '

                cursor.execute(sql, (user_from.id, user_target.id))

                db.commit()

                user = self.get(db, user_from.id)
                
                return user
        except Exception as e:
            print(f"Error while like user: {e}")
        return False
    
    def del_like(self, db: Session, user: User, like: Like):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = f'DELETE FROM likes WHERE id = "{like.id}" '

                cursor.execute(sql)
                
                db.commit()
                
                user = self.get(db, user.id)
                
                return user
        except Exception as e:
            print(f"Error while like user: {e}")
        return False
    
    def create_match(self, db: Session, current_user: User, user_target: User):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = 'INSERT INTO matches (user_A_id, user_B_id) VALUES (%s, %s) '

                cursor.execute(sql, (current_user.id, user_target.id))

                db.commit()

                user = self.get(db, current_user.id)
                
                return user
        except Exception as e:
            print(f"Error while like user: {e}")
        return False
    
    def delete_match(self, db: Session, user: User, match: Match):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = f'DELETE FROM matches WHERE id = "{match.id}" '

                cursor.execute(sql)
                
                db.commit()
                
                user = self.get(db, user.id)
                
                return user
        except Exception as e:
            print(f"Error while like user: {e}")
        return False

    def add_notif(self, db: Session, db_obj: User, notif: NotifCreate):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = f'INSERT INTO notifs (user_id, type, data {", data_user_id" if notif.data_user_id else ""}) VALUES (%s, %s, %s {", %s" if notif.data_user_id else ""}) '

                cursor.execute(sql, (db_obj.id, notif.type.value, notif.data, notif.data_user_id) if notif.data_user_id else (db_obj.id, notif.type, notif.data))

                db.commit()

                user = self.get(db, db_obj.id)
                
                return user
        except Exception as e:
            print(f"Error while add notif to user: {e}")
        return False

    def delete_notif(self, db: Session, db_obj: User, notif_to_delete):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = f'DELETE FROM notifs WHERE id = "{notif_to_delete.id}" '

                cursor.execute(sql)
                
                db.commit()
                
                user = self.get(db, db_obj.id)
                
                return user
        except Exception as e:
            print(f"Error while like user: {e}")
        return False

    def add_block(self, db: Session, user: User, user_target: User):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = f'INSERT INTO blocks (user_id, user_target_id) VALUES (%s, %s) '

                cursor.execute(sql, (user.id, user_target.id))

                db.commit()

                user = self.get(db, user.id)
                
                return user
        except Exception as e:
            print(f"Error while add notif to user: {e}")
        return False

    def remove_block(self, db: Session, user: User, block: Block):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = f'DELETE FROM blocks WHERE id = "{block.id}" '

                cursor.execute(sql)
                
                db.commit()
                
                user = self.get(db, user.id)
                
                return user
        except Exception as e:
            print(f"Error while like user: {e}")
        return False

    def add_like_photo(self, db: Session, user: User, photo: Photo):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = f'INSERT INTO like_photos (user_id, photo_id) VALUES (%s, %s) '

                cursor.execute(sql, (user.id, photo.id))

                db.commit()

                user = self.get(db, user.id)
                
                return user
        except Exception as e:
            print(f"Error while add notif to user: {e}")
        return False

    def remove_like_photo(self, db: Session, user: User, photo: Photo):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = f'DELETE FROM like_photos WHERE user_id = "{user.id}" AND photo_id = "{photo.id}"'

                cursor.execute(sql)

                db.commit()

                user = self.get(db, user.id)
                
                return user
        except Exception as e:
            print(f"Error while add notif to user: {e}")
        return False

    def add_seen(self, db: Session, user: User, user_target: User):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = f'INSERT INTO profile_seen (user_id, user_target_id) VALUES (%s, %s) '

                cursor.execute(sql, (user.id, user_target.id))

                db.commit()

                user = self.get(db, user.id)
                
                return user
        except Exception as e:
            print(f"Error while add notif to user: {e}")
        return False

    def add_fake(self, db, user, fake_user):
        try:
            with db.connection().connection.cursor() as cursor:

                sql = f'INSERT INTO fakes (user_id, user_target_id) VALUES (%s) '

                cursor.execute(sql, (user.id, fake_user.id))

                db.commit()

                return True
        except Exception as e:
            print(f"Error while add notif to user: {e}")
        return False
        
user = CRUDUser()
