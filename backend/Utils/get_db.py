from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine("mysql+pymysql://admin:admin@mysql-db/matcha")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# import pymysql.cursors
# import os

# def get_db():
#     connection = pymysql.connect(
#         host='mysql-db',
#         # host='127.0.0.1',
#         database=os.getenv('MYSQL_DATABASE'),
#         user=os.getenv('MYSQL_USER'),
#         password=os.getenv('MYSQL_PASSWORD'),
#         cursorclass=pymysql.cursors.DictCursor
#     )

#     try:
#         yield connection
#     finally:
#         connection.close()
