from sqlalchemy import Column, Integer, ForeignKey, Table
from Utils import Base

user_tag_association = Table(
    'user_tag_association',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)