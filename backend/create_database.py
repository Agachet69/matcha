# il est nesséaire d'importer toute les table voulans etre cree en DB 
from Model import User

from Utils import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine("mysql+mysqlconnector://admin:admin@mysql-db/matcha")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)