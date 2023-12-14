from typing import List
from Utils import get_db
from Schemas.token import TokenSchema
from Schemas.notif import NotifCreate
from Enum.NotifTypeEnum import NotifTypeEnum
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from Schemas.user import UserLogin, UserSchema, UserCreate, UserUpdate
import Crud
from Deps.user import get_user, get_current_user
from Utils import security
import uuid
from pathlib import Path as PathLib
from sqlalchemy.orm import Session
import Model 

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", status_code=status.HTTP_200_OK, response_model=TokenSchema)
def register(user_to_create: UserCreate, db=Depends(get_db)):
    if user := Crud.user.get_from_key(db, "username", user_to_create.username):
        raise HTTPException(status_code=400, detail="username already taken.")

    user_to_create.password = security.hash_password(user_to_create.password)
    user = Crud.user.create(db, user_to_create)

    return {
        "access_token": security.create_jwt_token(
            {"username": user_to_create.username, "password": user_to_create.password}
        ),
        "token_type": "bearer",
    }


@router.post("/login", status_code=status.HTTP_200_OK, response_model=TokenSchema)
def login(user_to_login: UserLogin, db=Depends(get_db)):
    if not (user := Crud.user.get_from_key(db, "username", user_to_login.username)):
        raise HTTPException(status_code=404, detail="Username incorrect")
    if not security.verify_password(user_to_login.password, user.password):
        raise HTTPException(status_code=400, detail="Password incorrect")
    return {
        "access_token": security.create_jwt_token(
            {"username": user.username, "password": user.password}
        ),
        "token_type": "bearer",
    }


@router.get("/", status_code=status.HTTP_200_OK, response_model=List[UserSchema])
def get_all_users(
    current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)
):
    return Crud.user.get_all(db)


@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserSchema)
def get_me(current_user: UserSchema = Depends(get_current_user)):
    return current_user

@router.post("/pic/{user_id}")
async def upload_image(user_id: int, images: List[UploadFile] = File(...), db:Session =Depends(get_db)):
      try:
        # Créer un dossier pour stocker les images s'il n'existe pas
        save_folder = f"uploads/images/{user_id}"
        PathLib(save_folder).mkdir(parents=True, exist_ok=True)
        for index, image in enumerate(images):
          filename = f"{user_id}__{index}_{image.filename}"

          # Chemin complet du fichier
          save_path = PathLib(save_folder) / filename

          # Écrire les données binaires de l'image dans le fichier
          with open(save_path, "wb") as file:
            file.write(image.file.read())
          
          photo = Model.Photo(user_id=user_id, path=str(save_path))

          # Ajouter l'instance à la session de la base de données
          db.add(photo)

        # Committer la session pour sauvegarder les changements
        db.commit()
      except:
        return "error"
    # images.filename = f"{uuid.uuid4()}.jpg"
    # contents = await images.read()
 
    # #save the file
    # with open(f"{'/user/'}{images.filename}", "wb") as f:
    #     f.write(contents)
 
    # return {"filename": images.filename}
    # db = SessionLocal()
    
    # try:
    #     content = await image.read()
    #     file_path = os.path.join("uploaded_images", image.filename)
    #     save_file(content, file_path)

    #     # Enregistrez l'image en base de données
    #     image_id = save_image_to_db(db, name, content)

    #     return {"message": "Image uploaded successfully", "image_id": image_id}
    # finally:
    #     db.close()


# @router.get("/add_notif", status_code=status.HTTP_200_OK, response_model=UserSchema)
# def get_me(current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)):
#     notif = NotifCreate(type=NotifTypeEnum.ERROR, data="Error")
#     return Crud.user.add_notif(db, current_user, notif)
