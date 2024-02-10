from typing import List
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.orm import relationship
from Utils import Base

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, Sequence("likes_id_seq"), primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user_target_id = Column(Integer, ForeignKey('users.id'))
        
    user = relationship("User", back_populates="likes", foreign_keys=[user_id])
    user_target = relationship("User", back_populates="liked_by", foreign_keys=[user_target_id])

