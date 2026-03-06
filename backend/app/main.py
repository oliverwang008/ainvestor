from fastapi import FastAPI, Query
from app.recommend import generate_recommendations
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "API-only AI recommender running"}

@app.get("/recommendations")
async def recommendations(
    symbols: list[str] = Query(default=["AAPL", "MSFT", "NVDA"]),
    k: int = 3,
):
    if k < 1 or k > 5:
        return {"error": "k must be between 1 and 5"}
    return await generate_recommendations(symbols, k=k)