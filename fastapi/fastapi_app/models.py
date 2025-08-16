from sqlalchemy import Column, Integer, Float, DateTime
from sqlalchemy.dialects.postgresql import INET
from .database import Base
from datetime import datetime

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(INET, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy = Column(Float)
    scheduled_end_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
