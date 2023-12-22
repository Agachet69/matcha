# from Utils import Base
# from sqlalchemy import Column, Sequence, Enum, Integer, ForeignKey
# from sqlalchemy.orm import relationship
# from Enum.TagEnum import TagEnum

# class Tag(Base):
#   __tablename__ = 'tag'
  
#   id = Column(int, Sequence('tag_id_sequence'), primary_key=True, index=True)
  
#   tag = Column(Enum(TagEnum))
  
#   user_id = Column(Integer, ForeignKey('users.id'))
  
#   user = relationship("User", back_populates="tag")