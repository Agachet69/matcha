# from Schemas.photo import PhotoSchema
from fastapi import Depends, HTTPException, status

from Utils import get_db
import Crud

def get_photo(
	db = Depends(get_db)
):
    photos = Crud.photo.get_all(db)
    
    if not photos:
        raise HTTPException(
          status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found."
        )

    return photos