# models.py
from typing import List
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.orm import relationship
from Utils import Base

class ProfileSeen(Base):
    __tablename__ = "profile_seen"

    id = Column(Integer, Sequence("profile_seen_id_seq"), primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user_target_id = Column(Integer, ForeignKey('users.id'))
        
    user = relationship("User", back_populates="profile_seen", foreign_keys=[user_id])
    user_target = relationship("User", back_populates="profile_seen_by", foreign_keys=[user_target_id])

