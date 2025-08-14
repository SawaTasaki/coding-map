from sqlalchemy.orm import Session
from . import models, schemas

def get_posts(db: Session):
    return db.query(models.Post).order_by(models.Post.id.desc()).all()

def create_post(db: Session, post: schemas.PostCreate):
    db_post = models.Post(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post
