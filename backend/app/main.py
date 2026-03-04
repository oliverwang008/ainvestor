from fastapi import FastAPI
from app.simulator import get_portfolio_status

app = FastAPI()

@app.get("/")
def root():
    return {"status": "AI Stock Agent Running"}

@app.get("/portfolio")
def portfolio():
    return get_portfolio_status()