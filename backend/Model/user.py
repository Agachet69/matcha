from typing import List
from Enum.GenderEnum import GenderEnum
from Enum.SexualityEnum import SexualityEnum
from Enum.StatusEnum import StatusEnum
from sqlalchemy import Column, Integer, String, Sequence, Enum, DateTime, Boolean
from sqlalchemy.orm import relationship
from Utils import Base
from Model.photo import Photo
from Model.like import Like
from Model.like_photo import LikePhoto
from Model.notif import Notif
from Model.tag import Tag
from Model.match import Match
from Model.block import Block
from Model.profile_seen import ProfileSeen

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
    fame_rate = Column(Integer, default=0)
    email_check = Column(Boolean, default=False)
    verification_code = Column(String(6), nullable=True, default=None)

    password = Column(String(256))
    tags: List[Tag] = relationship("Tag", back_populates="user")
    photos: List[Photo] = relationship("Photo", back_populates="user")
    notifs: List[Notif] = relationship("Notif", back_populates="user")
    
    likes: List[Like] = relationship("Like", back_populates="user", foreign_keys="[Like.user_id]")
    liked_by: List[Like] = relationship("Like", back_populates="user_target", foreign_keys="[Like.user_target_id]")
    
    profile_seen: List[ProfileSeen] = relationship("ProfileSeen", back_populates="user", foreign_keys="[ProfileSeen.user_id]")
    profile_seen_by: List[ProfileSeen] = relationship("ProfileSeen", back_populates="user_target", foreign_keys="[ProfileSeen.user_target_id]")

    blocked: List[Block] = relationship("Block", back_populates="user", foreign_keys="[Block.user_id]")
    blocked_by: List[Block] = relationship("Block", back_populates="user_target", foreign_keys="[Block.user_target_id]")

    matches_A = relationship("Match", foreign_keys="[Match.user_A_id]", back_populates="user_A")
    matches_B = relationship("Match", foreign_keys="[Match.user_B_id]", back_populates="user_B")

    like_photos: List[LikePhoto] = relationship("LikePhoto", back_populates="user", foreign_keys="[LikePhoto.user_id]")
