from typing import Literal, Optional

from fastapi import HTTPException, status


def user_name_validator(value: Optional[str]) -> str:
    if value is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Nullable name."
        )
    return value

special_characters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '{', '}', '[', ']', '|', '\\', ':', ';', '"', "'", '<', '>', ',', '.', '?', '/']

def password_validator(create_or_edit: Literal["CREATE", "EDIT"]):
    def func(value: Optional[str]) -> str:
        if value:
            if len(value) < 8:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must be at least 8 long.",
                )
            if not len([c for c in value if c.isalpha()]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must have at least one letter.",
                )
            if not len([c for c in value if c.isnumeric()]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must have at least one number.",
                )
            if not len([c for c in value if c.isalpha() and c.isupper()]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must have at least one upper letter.",
                )
            if not len([c for c in value if c in special_characters]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must have at one special character.",
                )
            character_not_allowed = set([c for c in value if not (c.isascii() and c.isalnum() or c in special_characters)])
            if length := len(character_not_allowed):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"""Character{"s" if length > 1 else ""} '{" ".join(character_not_allowed)}' {"are" if length > 1 else "is"} not allowed """,
                )
            
        elif create_or_edit == "CREATE":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 long.",
            )
            
        return value

    return func
