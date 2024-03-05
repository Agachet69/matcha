from Model import Tag
from Schemas.tag import TagCreate, TagUpdate
from .base import CRUDBase
from sqlalchemy.orm import Session

class CRUDTag(CRUDBase[Tag, TagCreate, TagUpdate]):
    
  def create_tag_for_user(self, db, tag: str, user_id):
    try:
      with db.connection().connection.cursor() as cursor:

          sql = f'''INSERT INTO tags (user_id, tag) VALUES (%s, %s)'''

          cursor.execute(sql, (user_id, tag))

          db.commit()

          return True
    except Exception as e:
      print(f"Error while creating user_tag_association: {e}")
    return False
  
  def remove_user_tags(self, db, tag):
    try: 
      with db.connection().connection.cursor() as cursor:
        
        deleted_sql = f'''DELETE FROM tags WHERE id = '{tag.id}';'''
        cursor.execute(deleted_sql)

        db.commit()
    except Exception as e:
      print(f"Error while deleting user tag: {e}")
    return False

tag = CRUDTag(Tag)