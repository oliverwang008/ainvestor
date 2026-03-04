from sqlalchemy import Column, Integer, Float, String, Date
from app.database import Base

class Portfolio(Base):
    __tablename__ = "portfolio"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    value = Column(Float)