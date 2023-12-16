from fastapi import APIRouter, FastAPI, status, Depends
from typing import List
from Schemas.photo import PhotoSchema
from Schemas.user import UserSchema
from Utils import get_db
# from fastapi.staticfiles import StaticFiles
from pathlib import Path
import Crud
from Deps.photo import get_photo
from Deps.user import get_current_user

router = APIRouter(prefix="/photo", tags=["Photos"])

# router.mount("/uploads/images", StaticFiles(directory=Path("uploads/images"), html=False), name="images")

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[PhotoSchema])
def get_all_photos(current_user: UserSchema = Depends(get_current_user)):
  return current_user.photos