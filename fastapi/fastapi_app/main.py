import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from . import models, schemas, crud
from .database import SessionLocal, engine
from .models import Post

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/posts", response_model=list[schemas.PostRead])
def read_posts(db: Session = Depends(get_db)):
    return crud.get_posts(db)

@app.post("/posts", response_model=schemas.PostRead)
def create_new_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
    return crud.create_post(db, post)
