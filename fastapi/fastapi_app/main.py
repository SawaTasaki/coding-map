import os
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from . import models, schemas
from .database import SessionLocal, engine

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

@app.get("/locations/latlng", response_model=list[schemas.LatLng])
def list_locations_latlng(db: Session = Depends(get_db)):
    rows = db.query(models.Location.latitude, models.Location.longitude).all()
    return [schemas.LatLng(latitude=lat, longitude=lon) for (lat, lon) in rows]

@app.post("/locations")
def create_location(payload: schemas.LocationCreate, request: Request, db: Session = Depends(get_db)):
    # クライアントIP（プロキシ環境なら X-Forwarded-For を優先）
    xff = request.headers.get("x-forwarded-for")
    client_ip = xff.split(",")[0].strip() if xff else (request.client.host or "0.0.0.0")

    loc = models.Location(
        ip_address=client_ip,
        latitude=payload.latitude,
        longitude=payload.longitude,
        accuracy=payload.accuracy,
        scheduled_end_at=payload.scheduled_end_at,  # ISO8601をPydanticがdatetimeにパース
    )
    db.add(loc)
    db.commit()
    db.refresh(loc)

    # 必要十分な情報を返す（response_modelを厳密にしたいなら後で追加可）
    return {
        "id": loc.id,
        "ip_address": str(loc.ip_address),
        "latitude": loc.latitude,
        "longitude": loc.longitude,
        "accuracy": loc.accuracy,
        "scheduled_end_at": loc.scheduled_end_at.isoformat() if loc.scheduled_end_at else None,
        "created_at": loc.created_at.isoformat() if getattr(loc, "created_at", None) else None,
    }
