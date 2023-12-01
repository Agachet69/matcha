# models.py
from typing import List
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.orm import relationship
from Utils import Base

class Notif(Base):
    __tablename__ = "notifs"

    id = Column(Integer, Sequence("user_id_seq"), primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="notifs")
    
    data = Column(String(256))
    
