from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from Model import Photo
from Schemas.photo import PhotoBase, PhotoCreate, PhotoUpdate
from Schemas.user import UserSchema
from Deps.user import get_current_user
from .base import CRUDBase

class CRUDPhoto(CRUDBase[Photo, PhotoCreate, PhotoUpdate]):
  
  def get_main(
    self, 
    db: Session, 
    current_user: UserSchema = Depends(get_current_user)
    ):
    
    return db.execute(
      select(self.model).where(
        (self.model.main == True) & (self.model.user_id == current_user.id),
      )
    ).scalar()

photo = CRUDPhoto(Photo)