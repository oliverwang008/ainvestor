import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
ALPHAVANTAGE_API_KEY = os.getenv("ALPHAVANTAGE_API_KEY", "")
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "")

if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY in .env")
if not ALPHAVANTAGE_API_KEY:
    raise RuntimeError("Missing ALPHAVANTAGE_API_KEY in .env")
if not FINNHUB_API_KEY:
    raise RuntimeError("Missing FINNHUB_API_KEY in .env")