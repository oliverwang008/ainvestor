import random
from datetime import date
from app.database import SessionLocal
from app.models import Portfolio

def run_daily_simulation():
    db = SessionLocal()
    value = random.uniform(99000, 101000)

    entry = Portfolio(
        date=str(date.today()),
        value=value
    )

    db.add(entry)
    db.commit()
    db.close()

def get_portfolio_status():
    db = SessionLocal()
    records = db.query(Portfolio).all()
    db.close()

    return [{"date": r.date, "value": r.value} for r in records]