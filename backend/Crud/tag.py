from Model import Tag
from Schemas.tag import TagCreate, TagUpdate
from .base import CRUDBase
from sqlalchemy.orm import Session

class CRUDTag(CRUDBase[Tag, TagCreate, TagUpdate]):
  
  def get_or_create_tag(self, db: Session, exist_tag: TagCreate):
    tag = db.query(Tag).filter(Tag.tag == exist_tag.tag).first()
    if tag:
        return tag
    else:
        new_tag = Tag(tag=exist_tag.tag)
        db.add(new_tag)
        db.commit()
        db.refresh(new_tag)
        return new_tag

tag = CRUDTag(Tag)