# models.py
from typing import List
from Enum.NotifTypeEnum import NotifTypeEnum
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Enum
from sqlalchemy.orm import relationship
from Utils import Base

class Notif(Base):
    __tablename__ = "notifs"

    id = Column(Integer, Sequence("notif_id_seq"), primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="notifs")
    
    type = Column(Enum(NotifTypeEnum))
    data = Column(String(256))
    data_user_id = Column(Integer, nullable=True)
    data_user = relationship("User", foreign_keys=[data_user_id], primaryjoin="Notif.data_user_id == User.id")
