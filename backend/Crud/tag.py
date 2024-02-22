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
    
  def create_tag_for_user(self, db, tag: Tag, user_id):
    try:
      print(tag.id, user_id)
      with db.connection().connection.cursor() as cursor:

          sql = f'''INSERT INTO user_tag_association (user_id, tag_id) 
              VALUES (%s, %s)'''

          cursor.execute(sql, (user_id, tag.id))

          db.commit()

          return True
    except Exception as e:
      print(f"Error while creating user_tag_association: {e}")
    return False
  
  def remove_user_tags(self, db, tag, user_id):
    try: 
      with db.connection().connection.cursor() as cursor:
        get_tag_sql = f'''SELECT id FROM tags WHERE tag='{tag}';'''

        cursor.execute(get_tag_sql)
        id = cursor.fetchone()[0]
        
        
        deleted_sql = f'''DELETE FROM user_tag_association WHERE tag_id = '{id}' AND user_id = '{user_id}';'''
        cursor.execute(deleted_sql)

        db.commit()
    except Exception as e:
      print(f"Error while deleting user tag: {e}")
    return False

tag = CRUDTag(Tag)