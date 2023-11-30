from typing import Optional

from .base import CRUDBase
from Model import User
from Schemas.user import UserCreate, UserUpdate


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    pass


user = CRUDUser(User)
