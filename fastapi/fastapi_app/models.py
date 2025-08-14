from sqlalchemy import Column, Integer, String, Text
from .database import Base

class Post(Base):
    __tablename__ = "post"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    username = Column(String(100), nullable=False)
    text = Column(Text, nullable=False)
