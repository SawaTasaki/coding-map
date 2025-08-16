from datetime import datetime
from pydantic import BaseModel

class LatLng(BaseModel):
    latitude: float
    longitude: float

class LocationCreate(BaseModel):
    latitude: float
    longitude: float
    accuracy: float | None = None
    # フロントからは ISO8601（例: "2025-08-17T06:01:00.000Z"）を渡してください
    scheduled_end_at: datetime
