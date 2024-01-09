# models.py
from typing import List
from Enum.GenderEnum import GenderEnum
from Enum.SexualityEnum import SexualityEnum
from Enum.StatusEnum import StatusEnum
from sqlalchemy import Column, Integer, String, Sequence, Enum, DateTime
from sqlalchemy.orm import relationship
from Utils import Base
from Model.photo import Photo
from Model.like import Like
from Model.notif import Notif
from Model.tag import Tag
from Model.association import user_tag_association
from Model.match import Match

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
    
    last_connection_date = Column(DateTime)
    
    latitude = Column(Integer)
    longitude = Column(Integer)
    # status = Column(Enum(StatusEnum))
    
    password = Column(String(256))

    tags= relationship("Tag", secondary=user_tag_association, back_populates="users")
    
    photos: List[Photo] = relationship("Photo", back_populates="user")
    
    notifs: List[Notif] = relationship("Notif", back_populates="user")
    
    likes: List[Like] = relationship("Like", back_populates="user", foreign_keys="[Like.user_id]")
    liked_by: List[Like] = relationship("Like", back_populates="user_target", foreign_keys="[Like.user_target_id]")

    matches_A = relationship("Match", foreign_keys="[Match.user_A_id]", back_populates="user_A")
    matches_B = relationship("Match", foreign_keys="[Match.user_B_id]", back_populates="user_B")

    @property
    def matches(self):
        return self.matches_A + self.matches_B

