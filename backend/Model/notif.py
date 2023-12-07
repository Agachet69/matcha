# models.py
from typing import List
from Enum.NotifType import NotifType
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Enum
from sqlalchemy.orm import relationship
from Utils import Base

class Notif(Base):
    __tablename__ = "notifs"

    id = Column(Integer, Sequence("notif_id_seq"), primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="notifs")
    
    data = Column(String(256))
    type = Column(Enum(NotifType))
