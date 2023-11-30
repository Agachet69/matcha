from typing import Optional

from fastapi import HTTPException, status

def user_name_validator(value: Optional[str]) -> str:
    if value is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Nullable name."
        )
    return value