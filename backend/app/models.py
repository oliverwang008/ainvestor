from sqlalchemy import Column, Integer, Float, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True)
    symbol = Column(String, unique=True, index=True)
    name = Column(String)
    exchange = Column(String)


class PriceDaily(Base):
    __tablename__ = "prices_daily"

    id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    date = Column(Date)

    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    volume = Column(Float)


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    published_at = Column(Date)

    title = Column(String)
    source = Column(String)
    summary = Column(Text)
    url = Column(String)


class Fundamental(Base):
    __tablename__ = "fundamentals"

    id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, ForeignKey("assets.id"))

    period_end = Column(Date)
    report_date = Column(Date)

    revenue = Column(Float)
    eps = Column(Float)
    net_income = Column(Float)


class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True)
    date = Column(Date)

    symbol = Column(String)
    action = Column(String)  # BUY / SELL / HOLD
    weight = Column(Float)
    reasoning = Column(Text)


class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True)

    date = Column(Date)
    symbol = Column(String)

    side = Column(String)
    quantity = Column(Float)
    price = Column(Float)


class Portfolio(Base):
    __tablename__ = "portfolio"

    id = Column(Integer, primary_key=True)

    date = Column(Date)
    nav = Column(Float)
    cash = Column(Float)