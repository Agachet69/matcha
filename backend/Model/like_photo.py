# models.py
from typing import List
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.orm import relationship
from Utils import Base

class LikePhoto(Base):
    __tablename__ = "like_photos"

    id = Column(Integer, Sequence("like_photos_id_seq"), primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="like_photos", foreign_keys=[user_id])
    
    photo_id = Column(Integer, ForeignKey('photos.id'))
    photo = relationship("Photo", foreign_keys=[photo_id])


