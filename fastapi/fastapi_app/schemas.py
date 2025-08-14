from pydantic import BaseModel

class PostBase(BaseModel):
    title: str
    username: str
    text: str

class PostCreate(PostBase):
    pass

class PostRead(PostBase):
    id: int

    class Config:
        orm_mode = True
