# models.py
from typing import List
from Enum.GenderEnum import GenderEnum
from Enum.SexualityEnum import SexualityEnum
from sqlalchemy import Column, Integer, String, Sequence, Enum
from sqlalchemy.orm import relationship
from Utils import Base
from Model.photo import Photo
from Model.like import Like
from Model.notif import Notif
# from Model.tag import Tag

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, Sequence("user_id_seq"), primary_key=True, index=True)
    username = Column(String(50))
    lastName = Column(String(50))
    firstName = Column(String(50))

    email = Column(String(50))
    
    gender = Column(Enum(GenderEnum))
    sexuality = Column(Enum(SexualityEnum))
    age = Column(Integer)
    
    bio = Column(String(400))
    
    
    
    # TODO: add position
    
    # photos
    
    
    
    password = Column(String(256))
    
    photos: List[Photo] = relationship("Photo", back_populates="user")
    
    notifs: List[Notif] = relationship("Notif", back_populates="user")
    
    # tags: List[Tag] = relationship("Tag", back_populates="user")
    
    likes: List[Like] = relationship("Like", back_populates="user", foreign_keys="[Like.user_id]")
    liked_by: List[Like] = relationship("Like", back_populates="user_target", foreign_keys="[Like.user_target_id]")

