# from Schemas.photo import PhotoSchema
from fastapi import Depends, HTTPException, status, Path, UploadFile, File
from sqlalchemy.orm import Session
from Utils import get_db
import Crud
import Model
from Deps.user import get_current_user
from Schemas.user import UserSchema
from Schemas.photo import PhotoSchema
from pathlib import Path as PathLib

def get_photo(
	db = Depends(get_db)
):
    photos = Crud.photo.get_all(db)
    
    if not photos:
        raise HTTPException(
          status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found."
        )

    return photos
  
def delete_with_id(
  db: Session,
  current_user: UserSchema,
  id: int = Path(..., title='id de la photo a supprimer'),
  ):
  
  photo: PhotoSchema = Crud.photo.get(db, id)
  if (current_user.id == photo.user_id):
    PathLib(photo.path).unlink()
    return Crud.photo.remove(db, id=id)
  else:
    raise HTTPException(status_code=400, detail="Ce n'est pas votre image")