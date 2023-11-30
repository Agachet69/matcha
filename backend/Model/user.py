# models.py
from sqlalchemy import Column, Integer, String, Sequence
from Utils import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, Sequence("user_id_seq"), primary_key=True, index=True)
    username = Column(String(50))
