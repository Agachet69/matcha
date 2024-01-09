from Model.user import User
from passlib.context import CryptContext
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from Utils import security

PASSWORD = "azerty"

user_list = [
    {
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
        "password": "admin",
    },
    {
        "username": "Alice",
        "lastName": "Smith",
        "firstName": "Alice",
        "email": "alice@example.com",
        "gender": "FEMALE",
        "sexuality": "HETEROSEXUAL",
        "age": 25,
        "bio": "I love exploring new places and trying exotic foods!",
        "last_connection_date": "2023-12-18T12:30:00",
        "latitude": 12.34,
        "longitude": 56.78,
        "password": PASSWORD,
    },
    {
        "username": "Bob",
        "lastName": "Johnson",
        "firstName": "Bob",
        "email": "bob@example.com",
        "gender": "MALE",
        "sexuality": "HETEROSEXUAL",
        "age": 30,
        "bio": "Tech enthusiast and coffee addict ☕️",
        "last_connection_date": "2023-12-17T18:45:00",
        "latitude": -34.56,
        "longitude": 78.90,
        "password": PASSWORD,
    },
    {
        "username": "Eva",
        "lastName": "eva",
        "firstName": "Eva",
        "email": "eva@example.com",
        "gender": "FEMALE",
        "sexuality": "HETEROSEXUAL",
        "age": 22,
        "bio": "Art lover and aspiring photographer 🎨📷",
        "last_connection_date": "2023-12-18T09:15:00",
        "latitude": 23.45,
        "longitude": -67.89,
        "password": PASSWORD,
    },
    {
        "username": "Alex",
        "lastName": "Johnson",
        "firstName": "Alex",
        "email": "alex@example.com",
        "gender": "MALE",
        "sexuality": "HETEROSEXUAL",
        "age": 28,
        "bio": "Software engineer by day, aspiring musician by night 🎸",
        "last_connection_date": "2023-12-18T15:45:00",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "password": PASSWORD,
    },
    {
        "username": "Emma",
        "lastName": "Smith",
        "firstName": "Emma",
        "email": "emma@example.com",
        "gender": "FEMALE",
        "sexuality": "HETEROSEXUAL",
        "age": 23,
        "bio": "Bookworm and coffee connoisseur ☕️📚",
        "last_connection_date": "2023-12-17T21:30:00",
        "latitude": 34.0522,
        "longitude": -118.2437,
        "password": PASSWORD,
    },
    {
        "username": "Charlie",
        "lastName": "Brown",
        "firstName": "Charlie",
        "email": "charlie@example.com",
        "gender": "MALE",
        "sexuality": "HETEROSEXUAL",
        "age": 32,
        "bio": "Adventure seeker and nature lover 🏞️",
        "last_connection_date": "2023-12-18T12:00:00",
        "latitude": -22.9068,
        "longitude": -43.1729,
        "password": PASSWORD,
    },
    {
        "username": "Sophie",
        "lastName": "Williams",
        "firstName": "Sophie",
        "email": "sophie@example.com",
        "gender": "FEMALE",
        "sexuality": "HETEROSEXUAL",
        "age": 26,
        "bio": "Travel enthusiast and foodie 🌍🍜",
        "last_connection_date": "2023-12-18T14:20:00",
        "latitude": 51.5074,
        "longitude": -0.1278,
        "password": PASSWORD,
    },
    {
        "username": "Jack",
        "lastName": "Miller",
        "firstName": "Jack",
        "email": "jack@example.com",
        "gender": "MALE",
        "sexuality": "HETEROSEXUAL",
        "age": 29,
        "bio": "Fitness freak and aspiring chef 💪🍳",
        "last_connection_date": "2023-12-17T19:10:00",
        "latitude": 34.0522,
        "longitude": -118.2437,
        "password": PASSWORD,
    },
    {
        "username": "Lily",
        "lastName": "Jones",
        "firstName": "Lily",
        "email": "lily@example.com",
        "gender": "FEMALE",
        "sexuality": "HETEROSEXUAL",
        "age": 24,
        "bio": "Music lover and weekend painter 🎶🎨",
        "last_connection_date": "2023-12-18T11:30:00",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "password": PASSWORD,
    },
    {
        "username": "Grace",
        "lastName": "Williams",
        "firstName": "Grace",
        "email": "grace@example.com",
        "gender": "FEMALE",
        "sexuality": "HETEROSEXUAL",
        "age": 28,
        "bio": "Yoga lover and nature enthusiast 🧘‍♀️🌳",
        "last_connection_date": "2023-12-18T14:30:00",
        "latitude": 34.0522,
        "longitude": -118.2437,
        "password": PASSWORD,
    },
    {
        "username": "Ethan",
        "lastName": "Miller",
        "firstName": "Ethan",
        "email": "ethan@example.com",
        "gender": "MALE",
        "sexuality": "HETEROSEXUAL",
        "age": 30,
        "bio": "Photography enthusiast and travel junkie 📸✈️",
        "last_connection_date": "2023-12-17T21:00:00",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "password": PASSWORD,
    },
    {
        "username": "Ava",
        "lastName": "Davis",
        "firstName": "Ava",
        "email": "ava@example.com",
        "gender": "FEMALE",
        "sexuality": "HETEROSEXUAL",
        "age": 26,
        "bio": "Fitness enthusiast and aspiring chef 💪🍲",
        "last_connection_date": "2023-12-18T12:45:00",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "password": PASSWORD,
    },
    {
        "username": "Logan",
        "lastName": "Johnson",
        "firstName": "Logan",
        "email": "logan@example.com",
        "gender": "MALE",
        "sexuality": "HETEROSEXUAL",
        "age": 29,
        "bio": "Outdoor adventurer and dog lover 🏞️🐾",
        "last_connection_date": "2023-12-18T16:15:00",
        "latitude": 51.5074,
        "longitude": -0.1278,
        "password": PASSWORD,
    },
    {
        "username": "Chloe",
        "lastName": "Taylor",
        "firstName": "Chloe",
        "email": "chloe@example.com",
        "gender": "FEMALE",
        "sexuality": "HETEROSEXUAL",
        "age": 24,
        "bio": "Artistic soul and aspiring painter 🎨",
        "last_connection_date": "2023-12-17T19:30:00",
        "latitude": 34.0522,
        "longitude": -118.2437,
        "password": PASSWORD,
    },
    {
        "username": "Mason",
        "lastName": "Moore",
        "firstName": "Mason",
        "email": "mason@example.com",
        "gender": "MALE",
        "sexuality": "HETEROSEXUAL",
        "age": 31,
        "bio": "Tech geek and coffee addict ☕️💻",
        "last_connection_date": "2023-12-18T13:45:00",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "password": PASSWORD,
    },
    {
        "username": "Lily",
        "lastName": "Jones",
        "firstName": "Lily",
        "email": "lily@example.com",
        "gender": "FEMALE",
        "sexuality": "HETEROSEXUAL",
        "age": 27,
        "bio": "Music lover and weekend adventurer 🎶🏞️",
        "last_connection_date": "2023-12-18T11:00:00",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "password": PASSWORD,
    },
    {
        "username": "Noah",
        "lastName": "Clark",
        "firstName": "Noah",
        "email": "noah@example.com",
        "gender": "MALE",
        "sexuality": "HETEROSEXUAL",
        "age": 28,
        "bio": "Gamer and aspiring game developer 🎮🕹️",
        "last_connection_date": "2023-12-17T22:15:00",
        "latitude": 34.0522,
        "longitude": -118.2437,
        "password": PASSWORD,
    },
    {
        "username": "Aria",
        "lastName": "Wilson",
        "firstName": "Aria",
        "email": "aria@example.com",
        "gender": "FEMALE",
        "sexuality": "HETEROSEXUAL",
        "age": 25,
        "bio": "Bookworm and aspiring writer 📚✍️",
        "last_connection_date": "2023-12-18T15:00:00",
        "latitude": 51.5074,
        "longitude": -0.1278,
        "password": PASSWORD,
    },
    {
        "username": "Caleb",
        "lastName": "Baker",
        "firstName": "Caleb",
        "email": "caleb@example.com",
        "gender": "MALE",
        "sexuality": "HETEROSEXUAL",
        "age": 30,
        "bio": "Musician and nature lover 🎸🌲",
        "last_connection_date": "2023-12-18T14:00:00",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "password": PASSWORD,
    },
]


engine = create_engine("mysql+pymysql://admin:admin@mysql-db/matcha", echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionLocal()

crypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

for user_to_create in user_list:
    print(user_to_create)
    user_to_create["password"] = security.hash_password(user_to_create["password"])
    db.add(User(**user_to_create))
    db.commit()
