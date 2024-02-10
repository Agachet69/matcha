from Utils import Base
from sqlalchemy import Column, Sequence, Enum, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from Enum.TagEnum import TagEnum
from Model.association import user_tag_association

class Tag(Base):
  __tablename__ = 'tags'
  
  id = Column(Integer, Sequence('tag_id_sequence'), primary_key=True, index=True)
  
  tag = Column(Enum(TagEnum))
  
  users = relationship("User", secondary=user_tag_association, back_populates="tags")