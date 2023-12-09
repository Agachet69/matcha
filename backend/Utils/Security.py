from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer

import jwt
from datetime import datetime, timedelta
from typing import Optional
import os

oauth2_scheme = OAuth2AuthorizationCodeBearer(tokenUrl="token", authorizationUrl="token")

class Security:
    def __init__(self):
        self.crypt_algorithm = "bcrypt"
        self.crypt_context = CryptContext(schemes=[self.crypt_algorithm], deprecated="auto")

    def hash_password(self, password: str):
        return self.crypt_context.hash(password)

    def verify_password(self, plain_password, hashed_password):
        return self.crypt_context.verify(plain_password, hashed_password)

    def create_jwt_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, os.getenv("SUPER_SECRET_KEY"), algorithm=os.getenv("ACCESS_TOKEN_ALGORITHM"))
        return encoded_jwt

    def verify_token(self, token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, os.getenv("SUPER_SECRET_KEY"), algorithms=[os.getenv("ACCESS_TOKEN_ALGORITHM")])
            return payload
        except jwt.PyJWTError:
            raise credentials_exception


security = Security()