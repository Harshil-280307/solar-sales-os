from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)
    phone = Column(String)

    bill = Column(Float)
    system_size = Column(Float)
    annual_savings = Column(Float)

    status = Column(String, default="new")

    follow_up_count = Column(Integer, default=0)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    last_contacted = Column(
        DateTime,
        default=datetime.utcnow
    )