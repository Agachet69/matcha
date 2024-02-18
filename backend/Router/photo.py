from fastapi import APIRouter, FastAPI, status, Depends, Path, HTTPException, UploadFile, File
from typing import List
from Schemas.photo import PhotoSchema
from Schemas.user import UserSchema
from Utils import get_db
from Deps.photo import get_photo, delete_with_id
from Deps.user import get_current_user
from pathlib import Path as PathLib
import Crud
import Model
import time
import os
from magic import Magic

router = APIRouter(prefix="/photo", tags=["Photos"])

def is_valid_image(file):
    mime = Magic(mime=True)
    file_type = mime.from_buffer(file.read(1024))
    return file_type.startswith('image')

def is_valid_file_size(file):
    file.seek(0, 2)
    file_size = file.tell()
    return  file_size <= (5000 * 1024)

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[PhotoSchema])
def get_all_photos(current_user: UserSchema = Depends(get_current_user)):
  return current_user.photos

@router.patch('/main', response_model=PhotoSchema)  
async def change_main(
  current_user: UserSchema = Depends(get_current_user),
  image: UploadFile = File(...),
  db = Depends(get_db)
  ):

  if not is_valid_image(image.file):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Fichier invalide.")
  if not is_valid_file_size(image.file):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Fichier trop volumineux.")
  image.file.seek(0)

  try:
    if (del_photo := Crud.photo.get_main(db, current_user)):
      delete_with_id(db, current_user, del_photo.id)
    save_folder = f"uploads/images/{current_user.id}"
    PathLib(save_folder).mkdir(parents=True, exist_ok=True)
        
    filename = f"{len(current_user.photos)}_{int(time.time() * 1000)}_{image.filename}"
    save_path = PathLib(save_folder) / filename
    with open(save_path, "wb") as file:
      file.write(image.file.read())
    photo = Model.Photo(user_id=current_user.id, path=str(save_path), main=True)
    db.add(photo)
    db.commit()
    return photo
      
  except:
    raise HTTPException(status_code=400, detail="5 photos max.")   

@router.post("/", response_model=PhotoSchema)
async def upload_image(
  current_user: UserSchema = Depends(get_current_user),
  image: UploadFile = File(...),
  db = Depends(get_db)):
    
  if not is_valid_image(image.file):
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Fichier invalide.")
  if not is_valid_file_size(image.file):
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Fichier trop volumineux.")
  image.file.seek(0)

  if (len([photo for photo in current_user.photos if not photo.main]) + 1 > 4):
    raise HTTPException(status_code=400, detail="4 photos d'arrière plan maximum.")
  
  try:
    save_folder = f"uploads/images/{current_user.id}"
    PathLib(save_folder).mkdir(parents=True, exist_ok=True)
      
    filename = f"{len(current_user.photos)}_{int(time.time() * 1000)}_{image.filename}"
    save_path = PathLib(save_folder) / filename
    with open(save_path, "wb") as file:
      file.write(image.file.read())
    photo = Model.Photo(user_id=current_user.id, path=str(save_path), main=False)
    db.add(photo)
    db.commit()
    return photo
  
  except:
    raise HTTPException(status_code=400, detail="An error has occurred")

@router.delete('/{id}')
def delete_photo(
  current_user: UserSchema = Depends(get_current_user), 
  id: int = Path(..., title='id to delete'),
  db=Depends(get_db)):
  return delete_with_id(db, current_user, id)
