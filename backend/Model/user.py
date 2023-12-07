# models.py
from typing import List
from sqlalchemy import Column, Integer, String, Sequence
from sqlalchemy.orm import relationship
from Utils import Base
from Model.like import Like
from Model.notif import Notif

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, Sequence("user_id_seq"), primary_key=True, index=True)
    username = Column(String(50))
    password = Column(String(100))
    
    notifs: List[Notif] = relationship("Notif", back_populates="user")
    
    likes: List[Like] = relationship("Like", back_populates="user")
    liked_by: List[Like] = relationship("Like", back_populates="user_target")

