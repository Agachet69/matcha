from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from Utils import get_db
import Crud


def get_user(
	user_id: int,
	db = Depends(get_db)
):
    user = Crud.user.get(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
        )

    return user