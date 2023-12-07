# il est nesséaire d'importer touts les table voulant etre cree en DB 
from Model import User

from Utils import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine("mysql+pymysql://admin:admin@mysql-db/matcha", echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)