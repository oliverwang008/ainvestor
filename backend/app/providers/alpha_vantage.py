from __future__ import annotations
import datetime as dt
import httpx

ALPHAVANTAGE_BASE = "https://www.alphavantage.co/query"

async def fetch_daily_prices(client: httpx.AsyncClient, api_key: str, symbol: str, days: int = 20) -> list[dict]:
    # function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=... (Alpha Vantage docs)
    params = {"function": "TIME_SERIES_DAILY_ADJUSTED", "symbol": symbol, "apikey": api_key, "outputsize": "compact"}
    r = await client.get(ALPHAVANTAGE_BASE, params=params, timeout=30)
    r.raise_for_status()
    data = r.json()

    ts = data.get("Time Series (Daily)", {})
    if not ts:
        note = data.get("Note") or data.get("Information") or data
        raise RuntimeError(f"AlphaVantage daily prices missing for {symbol}. Response: {note}")

    rows = []
    for date_str, v in ts.items():
        rows.append({
            "date": date_str,
            "open": float(v["1. open"]),
            "high": float(v["2. high"]),
            "low": float(v["3. low"]),
            "close": float(v["4. close"]),
            "adj_close": float(v["5. adjusted close"]),
            "volume": float(v["6. volume"]),
        })

    rows.sort(key=lambda x: x["date"], reverse=True)
    return rows[:days]

async def fetch_overview(client: httpx.AsyncClient, api_key: str, symbol: str) -> dict:
    # function=OVERVIEW&symbol=IBM&apikey=...
    params = {"function": "OVERVIEW", "symbol": symbol, "apikey": api_key}
    r = await client.get(ALPHAVANTAGE_BASE, params=params, timeout=30)
    r.raise_for_status()
    data = r.json()
    if not data or "Symbol" not in data:
        note = data.get("Note") or data.get("Information") or data
        raise RuntimeError(f"AlphaVantage overview missing for {symbol}. Response: {note}")
    return data

def compute_simple_features(prices: list[dict]) -> dict:
    # prices sorted newest-first
    if len(prices) < 6:
        return {"close": None, "ret_1d": None, "ret_5d": None}

    close0 = prices[0]["adj_close"]
    close1 = prices[1]["adj_close"]
    close5 = prices[5]["adj_close"]

    ret_1d = (close0 / close1) - 1.0
    ret_5d = (close0 / close5) - 1.0

    return {"close": close0, "ret_1d": ret_1d, "ret_5d": ret_5d, "asof": prices[0]["date"]}