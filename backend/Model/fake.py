from typing import List
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.orm import relationship
from Utils import Base

class Fake(Base):
    __tablename__ = "fakes"

    id = Column(Integer, Sequence("blocks_id_seq"), primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user_target_id = Column(Integer, ForeignKey('users.id'))
