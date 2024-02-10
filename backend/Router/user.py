import datetime
from typing import List
from Utils import get_db
from Schemas.token import TokenSchema
from Enum.StatusEnum import StatusEnum
from Schemas.notif import NotifCreate
from Enum.NotifTypeEnum import NotifTypeEnum
from Schemas.like import LikeSchema
from Schemas.match import MatchCreate
from Schemas.search import SearchSchema
from fastapi import APIRouter, Depends, HTTPException, status
from Schemas.user import UserLogin, UserSchema, UserCreate, UserUpdate, ValidateEmail, ForgotPasswordSendCode, ForgotPassword, UserSearchSchema, ChangePassword
from Schemas.tag import TagCreate
import Crud
from Deps.user import get_user, get_current_user
from Utils import security
import uuid
from pathlib import Path as PathLib
from sqlalchemy.orm import Session
from Socket import connected_clients, disconnect_clients
from fastapi.encoders import jsonable_encoder
import random
import string
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
import math

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[UserSchema])
def get_all_users(
    current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)
):
    user_list = Crud.user.get_all(db)
    
    id_arr = [client["auth"]["user_id"] for client in connected_clients] + [client["user_id"] for client in disconnect_clients]
    status_dict = {}
    for user in user_list:
        if user.id in id_arr:
            status_dict[user.id] = "ONLINE"
        else:
            status_dict[user.id] = "OFFLINE"

    for user in user_list:
        user.status = status_dict.get(user.id, "UNKNOWN")

    return user_list


@router.post("/resend_code", status_code=status.HTTP_200_OK)
def resend_code(current_user = Depends(get_current_user), db = Depends(get_db)):
    if current_user.email_check:
        raise HTTPException(status_code=400, detail="Email already verified.")
    verification_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = os.getenv("STMP_USERNAME")
    smtp_password = os.getenv("STMP_PASSWORD")

    
    sender_email = os.getenv("STMP_USERNAME")
    subject = 'Email Verification'
    message = f'Code :{verification_code}'

    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = current_user.email
    msg['Subject'] = subject

    
    msg.attach(MIMEText(message, 'plain'))

    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, current_user.email, msg.as_string())
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        raise HTTPException(status_code=400, detail="Error when send the verification email.")
    
    user_update = UserUpdate(verification_code=verification_code)

    Crud.user.update(db=db, db_obj=current_user, obj_in=user_update)

@router.post("/forgot_password", status_code=status.HTTP_200_OK, response_model=bool)
def forgot_password(forgot_password: ForgotPassword, db = Depends(get_db)):
    if not (user := Crud.user.get_from_key(db, 'username', forgot_password.username)):
        raise HTTPException(status_code=404, detail="User not found.")
    if user.verification_code != forgot_password.code:
        raise HTTPException(status_code=400, detail="Code is not correct.")
    
    update_obj = UserUpdate(password=security.hash_password(forgot_password.password), verification_code=None)
    Crud.user.update(db, db_obj=user, obj_in=update_obj)

    return True

@router.post("/forgot_password_send_code", status_code=status.HTTP_200_OK, response_model=bool)
def forgot_password_send_code(forgot_password_send_code: ForgotPasswordSendCode, db = Depends(get_db)):
    if not (user := Crud.user.get_from_key(db, 'username', forgot_password_send_code.username)):
        raise HTTPException(status_code=404, detail="User not found.")

    verification_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    smtp_server = 'smtp.gmail.com'
    smtp_port = 587  
    smtp_username = os.getenv("STMP_USERNAME")
    smtp_password = os.getenv("STMP_PASSWORD")

    
    sender_email = os.getenv("STMP_USERNAME")
    subject = 'Forgot Password'
    message = f'Link :  https://localhost:3000/forgot_password?code={verification_code}&username={user.username}'

    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = user.email
    msg['Subject'] = subject

    
    msg.attach(MIMEText(message, 'plain'))

    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, user.email, msg.as_string())
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        raise HTTPException(status_code=400, detail="Error when send the email.")
    
    user_update = UserUpdate(verification_code=verification_code)

    Crud.user.update(db=db, db_obj=user, obj_in=user_update)
    
    return True

@router.post("/verif_email", status_code=status.HTTP_200_OK, response_model=UserSchema)
def verif_email(validate_email: ValidateEmail, current_user = Depends(get_current_user), db = Depends(get_db)):
    if current_user.email_check:
        raise HTTPException(status_code=400, detail="Email already verified.")
    if current_user.verification_code != validate_email.code:
        raise HTTPException(status_code=400, detail="Code is not correct.")
    

    update_obj = UserUpdate(email_check=True, verification_code=None)
    Crud.user.update(db=db, db_obj=current_user, obj_in=update_obj)
    return current_user 

@router.post("/register", status_code=status.HTTP_200_OK, response_model=TokenSchema)
def register(user_to_create: UserCreate, db=Depends(get_db)):
    if user := Crud.user.get_from_key(db, "username", user_to_create.username):
        raise HTTPException(status_code=400, detail="Username already taken.")

    verification_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587  
    smtp_username = os.getenv("STMP_USERNAME")
    smtp_password = os.getenv("STMP_PASSWORD")

    
    sender_email = os.getenv("STMP_USERNAME")
    subject = 'Email Verification'
    message = f'Code: {verification_code}'

    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = user_to_create.email
    msg['Subject'] = subject

    
    msg.attach(MIMEText(message, 'plain'))

    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, user_to_create.email, msg.as_string())
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        raise HTTPException(status_code=400, detail="Error when send the verification email.")


    server.quit()

    
    user_to_create.password = security.hash_password(user_to_create.password)
    user_to_create.last_connection_date = datetime.datetime.now()

    
    user = Crud.user.create(db, user_to_create, verification_code)

    
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
        raise HTTPException(status_code=404, detail="Password incorrect")
    
    user_update = UserUpdate(last_connection_date=datetime.datetime.now(), latitude=user_to_login.latitude, longitude=user_to_login.longitude)

    Crud.user.update(db, db_obj=user, obj_in=user_update)
    return {
        "access_token": security.create_jwt_token(
            {"username": user.username, "password": user.password}
        ),
        "token_type": "bearer",
    }

@router.post("/change_password", status_code=status.HTTP_200_OK, response_model=TokenSchema)
def login(change_password: ChangePassword, current_user = Depends(get_current_user), db=Depends(get_db)):
    if not security.verify_password(change_password.last_password, current_user.password):
        raise HTTPException(status_code=400, detail="Last password incorrect")
    
    user_update = UserUpdate(password=security.hash_password(change_password.new_password))

    Crud.user.update(db, db_obj=current_user, obj_in=user_update)
    return {
        "access_token": security.create_jwt_token(
            {"username": current_user.username, "password": current_user.password}
        ),
        "token_type": "bearer",
    }
    
@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserSchema)
def get_me(current_user: UserSchema = Depends(get_current_user)):
    return current_user

@router.put('/', status_code=status.HTTP_200_OK, response_model=UserSchema)
def update_user(user_update: UserUpdate, current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)):
    return Crud.user.update(db, db_obj=current_user, obj_in=user_update)

@router.put('/tags', response_model=UserSchema)
def update_tags(tags: List[TagCreate], current_user= Depends(get_current_user), db= Depends(get_db)):
  
  if (len(tags) > 5):
    raise HTTPException(status_code=400, detail="You can't have more than 5 tags.")
  
  user = Crud.user.get(db, current_user.id)
  if user is None:
    raise HTTPException(status_code=404, detail="User not found")
  
  all_tags = []
  for exist_tag in tags:
    tag = Crud.tag.get_or_create_tag(db, exist_tag)
    all_tags.append(tag)
    
  user.tags = all_tags
  db.commit()
  db.refresh(user)
  
  return user

@router.get("/{user_id}", status_code=status.HTTP_200_OK, response_model=UserSchema)
def get_one_user(
    current_user: UserSchema = Depends(get_current_user), user: UserSchema = Depends(get_user)
):
    id_arr = [client["auth"]["user_id"] for client in connected_clients] + [client["user_id"] for client in disconnect_clients]
    if user.id in id_arr:
        user.status = 'ONLINE'
    else:
        user.status = 'OFFLINE'
    return user

@router.post("/search", status_code=status.HTTP_200_OK, response_model=List[UserSearchSchema])
async def search(
    search_params: SearchSchema,
    current_user: UserSchema = Depends(get_current_user),
    db=Depends(get_db)
):
    def haversine(lat1, lon1, lat2, lon2):
        """
        Calculate the great circle distance between two points
        on the earth specified in decimal degrees
        """
        
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

        
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        
        
        R = 6371  

        
        distance = R * c
        return distance


    user_list = Crud.user.search(db, current_user, search_params)
    id_arr = [client["auth"]["user_id"] for client in connected_clients] + [client["user_id"] for client in disconnect_clients]
    status_dict = {}
    for user in user_list:
        if user.id in id_arr:
            status_dict[user.id] = "ONLINE"
        else:
            status_dict[user.id] = "OFFLINE"
    
    for user in user_list:
        user.status = status_dict.get(user.id, "UNKNOWN")
        user.distance = haversine(current_user.latitude, current_user.longitude, user.latitude, user.longitude)
    return user_list

@router.post("/like/{user_id}", status_code=status.HTTP_200_OK, response_model=UserSchema)
async def like(
    current_user: UserSchema = Depends(get_current_user), user_to_like: UserSchema = Depends(get_user), db=Depends(get_db)
):
    from Socket.socket import socket_manager
    
    for blocked in user_to_like.blocked:
        if (blocked.user_target_id == current_user.id):
            raise HTTPException(status_code=400, detail="This user as blocked you.")

    user_match = next((user_match for user_match in current_user.matches if user_match.user_A_id == user_to_like.id or user_match.user_B_id == user_to_like.id), None)
    if user_match != None:
        Crud.match.remove(db, id=user_match.id)
        db.refresh(current_user)
        
        notif_to_create = NotifCreate(
            data=f'{current_user.username} has un-match you.',
            data_user_id=current_user.id,
            type=NotifTypeEnum.LIKE
        )
        user = Crud.user.add_notif(db, user_to_like, notif_to_create)
        if client := next((client for client in connected_clients if client['auth']['user_id'] == user_to_like.id), None):
            await socket_manager.emit('add-notification', {
                'data': user.notifs[-1].data,
                'data_user_id': user.notifs[-1].data_user_id,
                'type': user.notifs[-1].type.value
            }, room=client["sid"])
        
        return current_user
    
    
    like = next((like for like in current_user.likes if like.user_target_id == user_to_like.id), None)
    if like != None:
        Crud.like.remove(db, id=like.id)
        db.refresh(current_user)
        notif_to_create = NotifCreate(
            data=f'{current_user.username} has no longer a crush on you.',
            data_user_id=current_user.id,
            type=NotifTypeEnum.LIKE
        )
        user = Crud.user.add_notif(db, user_to_like, notif_to_create)

        update_obj = UserUpdate(fame_rate=user.fame_rate-1)
        user = Crud.user.update(db, db_obj=user, obj_in=update_obj)


        if client := next((client for client in connected_clients if client['auth']['user_id'] == user_to_like.id), None):
            await socket_manager.emit('add-notification', {
                'data': user.notifs[-1].data,
                'data_user_id': user.notifs[-1].data_user_id,
                'type': user.notifs[-1].type.value
            }, room=client["sid"])
        return current_user
    
    
    like_target = next((like for like in user_to_like.likes if like.user_target_id == current_user.id), None)
    if like_target != None:
        Crud.like.remove(db, id=like_target.id)
        Crud.match.create(db, MatchCreate(**{
            "user_A_id": current_user.id,
            "user_B_id": user_to_like.id,
        }))
        notif_to_create = NotifCreate(
            data=f"""It's a MATCH !""",
            data_user_id=current_user.id,
            type=NotifTypeEnum.MATCH
        )
        user = Crud.user.add_notif(db, user_to_like, notif_to_create)
        if client := next((client for client in connected_clients if client['auth']['user_id'] == user_to_like.id), None):
            await socket_manager.emit('add-notification', {
                'data': user.notifs[-1].data,
                'data_user_id': user.notifs[-1].data_user_id,
                'type': user.notifs[-1].type.value
            }, room=client["sid"])
        db.refresh(current_user)

        user_update_obj = UserUpdate(fame_rate=user.fame_rate+2)
        user = Crud.user.update(db, db_obj=user, obj_in=user_update_obj)

        current_user_update_obj = UserUpdate(fame_rate=current_user.fame_rate+1)
        current_user = Crud.user.update(db, db_obj=current_user, obj_in=current_user_update_obj)

        return current_user
    
    
    current_user = Crud.user.like(db, current_user, user_to_like)
    notif_to_create = NotifCreate(
        data=f'{current_user.username} has a crush on you.',
        data_user_id=current_user.id,
        type=NotifTypeEnum.LIKE
    )
    user = Crud.user.add_notif(db, user_to_like, notif_to_create)
    if client := next((client for client in connected_clients if client['auth']['user_id'] == user_to_like.id), None):
        await socket_manager.emit('add-notification', {
            'data': user.notifs[-1].data,
            'data_user_id': user.notifs[-1].data_user_id,
            'type': user.notifs[-1].type.value
        }, room=client["sid"])

    user_update_obj = UserUpdate(fame_rate=user.fame_rate+1)
    user = Crud.user.update(db, db_obj=user, obj_in=user_update_obj)

    return current_user

@router.delete("/del_notif/{notif_id}", status_code=status.HTTP_200_OK, response_model=UserSchema)
def del_notif(notif_id: int, current_user: UserSchema = Depends(get_current_user), db=Depends(get_db)):
    if not (notif := next(notif for notif in current_user.notifs if notif.id == notif_id)):
        raise HTTPException(status_code=404, detail="Notification not found")
    Crud.user.delete_notif(db, current_user, notif)
    db.refresh(current_user)
    return current_user








@router.post("/block/{user_id}", status_code=status.HTTP_200_OK, response_model=UserSchema)
def block_user(current_user: UserSchema = Depends(get_current_user), target_user = Depends(get_user), db=Depends(get_db)):
    if block := next((block for block in current_user.blocked if block.user_target_id == target_user.id), None):
        Crud.user.remove_block(db, current_user, target_user)
    else:
        Crud.user.add_block(db, current_user, target_user)
    db.refresh(current_user)
    return current_user

@router.post("/see/{user_id}", status_code=status.HTTP_200_OK, response_model=UserSchema)
async def see(
    current_user: UserSchema = Depends(get_current_user), user_to_see: UserSchema = Depends(get_user), db=Depends(get_db)
):
    
    if not (profile_seen := next((profile_seen for profile_seen in current_user.profile_seen if profile_seen.user_target_id == user_to_see.id), None)):
        Crud.user.add_seen(db, current_user, user_to_see)



@router.post("/like_photo/{photo_id}", status_code=status.HTTP_200_OK, response_model=UserSchema)
def like_photo(
    photo_id: int,
    current_user: UserSchema = Depends(get_current_user),
    db=Depends(get_db)
):
    
    if not (photo := Crud.photo.get(db, photo_id)):
        raise HTTPException(status_code=404, detail="Photo not found.")

    if next((like_photo for like_photo in current_user.like_photos if like_photo.photo_id == photo.id), None):
        Crud.user.remove_like_photo(db, current_user, photo)
    else:
        Crud.user.add_like_photo(db, current_user, photo)
        
    db.refresh(current_user)
    return current_user
