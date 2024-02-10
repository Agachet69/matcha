from typing import List
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.orm import relationship
from Utils import Base

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, Sequence("matches_id_seq"), primary_key=True, index=True)
    
    user_A_id = Column(Integer, ForeignKey('users.id'))
    user_B_id = Column(Integer, ForeignKey('users.id'))
        
    user_A = relationship("User", back_populates="matches_A", foreign_keys=[user_A_id])
    user_B = relationship("User", back_populates="matches_B", foreign_keys=[user_B_id])

