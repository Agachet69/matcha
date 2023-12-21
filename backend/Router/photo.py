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

router = APIRouter(prefix="/photo", tags=["Photos"])


@router.get("/", status_code=status.HTTP_200_OK, response_model=List[PhotoSchema])
def get_all_photos(current_user: UserSchema = Depends(get_current_user)):
  return current_user.photos

@router.patch('/main', response_model=PhotoSchema)  
def change_main(
  current_user: UserSchema = Depends(get_current_user),
  image: UploadFile = File(...),
  db = Depends(get_db)
  ):
  
  try:
    if (del_photo := Crud.photo.get_main(db, current_user)):
      delete_with_id(db, current_user, del_photo.id)
    
    save_folder = f"uploads/images/{current_user.id}"
    PathLib(save_folder).mkdir(parents=True, exist_ok=True)
        
    filename = f"{current_user.id}_{len(current_user.photos)}_{image.filename}"
    save_path = PathLib(save_folder) / filename
    with open(save_path, "wb") as file:
      file.write(image.file.read())
    photo = Model.Photo(user_id=current_user.id, path=str(save_path), main=True)
    db.add(photo)
    db.commit()
    print(photo.path)
    return photo
      
  except:
    raise HTTPException(status_code=400, detail="5 photos max.")
     

@router.post("/")
async def upload_image(
  current_user: UserSchema = Depends(get_current_user),
  images: List[UploadFile] = File(...),
  db = Depends(get_db)):
  
  if (len(current_user.photos) + len(images) > 5):
      raise HTTPException(status_code=400, detail="5 photos max.")
  try:
    save_folder = f"uploads/images/{current_user.id}"
    PathLib(save_folder).mkdir(parents=True, exist_ok=True)
        
    for index, image in enumerate(images):
      filename = f"{current_user.id}_{index}_{image.filename}"
      save_path = PathLib(save_folder) / filename
      with open(save_path, "wb") as file:
        file.write(image.file.read())
      photo = Model.Photo(user_id=current_user.id, path=str(save_path), main=False)
      db.add(photo)
    db.commit()
  except:
    raise HTTPException(status_code=400, detail="An error has occurred")

@router.delete('/{id}')
def delete_photo(
  current_user: UserSchema = Depends(get_current_user), 
  id: int = Path(..., title='id de la photo a supprimer'),
  db=Depends(get_db)):
  return delete_with_id(db, current_user, id)
