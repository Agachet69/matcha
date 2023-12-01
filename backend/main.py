# backend/main.py

from typing import Any

from Utils import Base, get_db

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Sequence
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware

from Router import api_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace "*" with a list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # You can replace "*" with a list of allowed HTTP methods
    allow_headers=["*"],  # You can replace "*" with a list of allowed HTTP headers
)

app.include_router(api_router)

# # Dependency to get the database session

# Your FastAPI routes go here
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/create")
def create(data: dict, db = Depends(get_db)):
    # print(data)
    # item = Item(**{"name": "Oui", "description": ""})
    # db.add(item)
    # db.commit()
    # db.refresh(item)
    
    # return item
    pass

@app.get("/edit/{item_id}")
def edit(db = Depends(get_db)):
    pass
    # item = Item(**{"name": "Oui", "description": ""})
    # db.add(item)
    # db.commit()
    # db.refresh(item)
    # 
    # return item
