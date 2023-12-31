
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select, update
from sqlalchemy.orm import Session, noload

from Utils import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, db: Session, id: Any, **kwargs) -> Optional[ModelType]:
        return db.execute(
            select(self.model).where(
                self.model.id == id,
            )
        ).scalar()

    def get_from_key(self, db: Session, key: str, key_value: Any, **kwargs) -> Optional[ModelType]:
        return db.execute(
            select(self.model).where(
                getattr(self.model, key) == key_value,
            )
        ).scalar()

    def get_all(self, db: Session, **kwargs) -> List[ModelType]:
        stmt = select(self.model)
        return db.execute(stmt).scalars().all()

    def create(self, db: Session, obj_in: CreateSchemaType, **kwargs) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        obj_data = vars(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> ModelType:
        obj = (
            db.execute(select(self.model).where(self.model.id == id)).scalars().first()
        )
        db.delete(obj)
        db.commit()
        return obj