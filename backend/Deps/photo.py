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
  
# def get_main(
#   db = Depends(get_db),
#   current_user: UserSchema = Depends(get_current_user)):
#   photo = db.query(Model.Photo).filter(Model.Photo.main == True, Model.Photo.user_id == current_user.id).all()
#   return photo
  
# def upload(
#   main: bool,
#   image: UploadFile = File(...)):
  

  
#   current_user = get_current_user()
#   db = get_db()
  
#   save_folder = f"uploads/images/{current_user.id}"
#   PathLib(save_folder).mkdir(parents=True, exist_ok=True)
#   index = len(current_user.photos)
#   filename = f"{current_user.id}_{index}_{image.filename}"
#   save_path = PathLib(save_folder) / filename
#   with open(save_path, "wb") as file:
#     file.write(image.file.read())
#     photo = Model.Photo(user_id=current_user.id, path=str(save_path), main=main)
#     db.add(photo)
#   db.commit()