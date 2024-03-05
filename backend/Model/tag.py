from Utils import Base
from sqlalchemy import Column, Sequence, Enum, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from Enum.TagEnum import TagEnum

class Tag(Base):
  __tablename__ = 'tags'
  
  id = Column(Integer, Sequence('tag_id_sequence'), primary_key=True, index=True)
  
  user_id = Column(Integer, ForeignKey('users.id'))
  user = relationship("User", back_populates="tags")

  tag = Column(Enum(TagEnum))
  