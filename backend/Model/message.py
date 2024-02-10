from typing import List
from Enum.NotifTypeEnum import NotifTypeEnum
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from Utils import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, Sequence("message_id_seq"), primary_key=True, index=True)
    
    user_A_id = Column(Integer, ForeignKey('users.id'))
    user_B_id = Column(Integer, ForeignKey('users.id'))

    data = Column(String(256))
    date = Column(DateTime)