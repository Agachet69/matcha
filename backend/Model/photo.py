from typing import List
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from Utils import Base

class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, Sequence("photos_id_seq"), primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    
    path = Column(String(128))
    
    main = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="photos")

