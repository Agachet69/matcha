import shutil
import os
import random
import sys
import uuid
from Model.user import User
from passlib.context import CryptContext
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from Utils import security

PASSWORD = "Qwerty123!"

admin_account = {
    "username": "admin",
    "lastName": "admin",
    "firstName": "admin",
    "email": "admin@example.com",
    "gender": "MALE",
    "sexuality": "HETEROSEXUAL",
    "age": 999,
    "bio": "Admin account.",
    "last_connection_date": "2023-12-18T12:30:00",
    "latitude": 12.34,
    "longitude": 56.78,
    "password": "Admin123!",
}


engine = create_engine("mysql+pymysql://admin:admin@mysql-db/matcha", echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionLocal()

crypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


firstnames = ["John", "Emma", "Michael", "Sophia", "William", "Olivia", "James", "Ava", "Alexander", "Isabella"]
lastnames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"]
genders = ["MALE", "FEMALE"]
sexualitys = ["HETEROSEXUAL", "HOMOSEXUAL", "BISEXUAL"]

def generate_users(num_users):
    users = []

    for _ in range(num_users):
        firstName = random.choice(firstnames)
        firstName_count = sum(1 for obj in users if obj['firstName'] == firstName)
        lastName = random.choice(lastnames)
        gender = random.choice(genders)
        sexuality = random.choice(sexualitys)
        age = random.randint(18, 100)
        latitude = random.randint(-90, 90)
        longitude = random.randint(-180, 180)

        users.append({
            "username": f'{firstName}{"" if not firstName_count else firstName_count}',
            "lastName": lastName,
            "firstName": firstName,
            "email": f"{firstName}.{lastName}@example.com",
            "gender": gender,
            "sexuality": sexuality,
            "age": age,
            "bio": "",
            "last_connection_date": "2023-12-18T12:30:00",
            "latitude": latitude,
            "longitude": longitude,
            "password": PASSWORD,
        })

    return users

if len(sys.argv) < 2:
    print('Usage : python create_user_batch.py <number_of_user>')
    sys.exit(1)

arg = sys.argv[1]

if not arg.isdigit():
    raise ValueError('Argument must be a number.')


num_users = int(arg) - 1

if num_users < 0:
    raise ValueError('Argument must be superior to 0.')

users = generate_users(num_users)
users.insert(0, admin_account)
print("Generated", len(users), "users:")

if not os.path.isdir('uploads'):
    os.mkdir('uploads')
if not os.path.isdir('uploads/images'):
    os.mkdir('uploads/images')




try:
    with db.connection().connection.cursor() as cursor:
        for user_to_create in users:
            print(user_to_create)
            user_to_create["password"] = security.hash_password(user_to_create["password"])

            sql = f'''INSERT INTO users (username, lastName, firstName, email, gender, sexuality, 
                age, bio, password, latitude, longitude, fame_rate, last_connection_date, email_check, verification_code) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''

            cursor.execute(sql, (user_to_create['username'], user_to_create['lastName'], user_to_create['firstName'], user_to_create['email'],
                user_to_create['gender'], user_to_create['sexuality'], user_to_create['age'], user_to_create['bio'],
                user_to_create['password'], user_to_create['latitude'], user_to_create['longitude'], '0',
                datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), '1', ''))
            
            user_id = cursor.lastrowid


            if not os.path.isdir(f'uploads/images/{user_id}'):
                os.mkdir(f'uploads/images/{user_id}')


            if user_to_create['gender'] == 'MALE':
                image_path = 'man'
            else:
                image_path = 'woman'

            image_path = image_path + str(random.randint(1, 10)) + '.jpg'

            new_image_name_path = f'uploads/images/{user_id}/{uuid.uuid4()}'

            shutil.copy(f'assets/{image_path}', new_image_name_path)

            sql = f'''INSERT INTO photos (user_id, path, main) VALUES (%s, %s, %s)'''

            cursor.execute(sql, (user_id, new_image_name_path, '1'))





        db.commit()
except Exception as e:
    print(f"Error while creating user: {e}")
