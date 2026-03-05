from __future__ import annotations
import datetime as dt
import httpx

FINNHUB_BASE = "https://finnhub.io/api/v1"

async def fetch_quote(client: httpx.AsyncClient, api_key: str, symbol: str) -> dict:
    r = await client.get(f"{FINNHUB_BASE}/quote", params={"symbol": symbol, "token": api_key}, timeout=30)
    r.raise_for_status()
    data = r.json()
    if not data or data.get("c") in (None, 0):
        raise RuntimeError(f"Finnhub quote missing for {symbol}: {data}")
    return data  # c=current, pc=prev close, etc.

async def fetch_daily_candles(client: httpx.AsyncClient, api_key: str, symbol: str, days: int = 30) -> list[dict]:
    end = int(dt.datetime.now().timestamp())
    start = int((dt.datetime.now() - dt.timedelta(days=days)).timestamp())
    params = {"symbol": symbol, "resolution": "D", "from": start, "to": end, "token": api_key}
    r = await client.get(f"{FINNHUB_BASE}/stock/candle", params=params, timeout=30)
    r.raise_for_status()
    data = r.json()
    if data.get("s") != "ok":
        raise RuntimeError(f"Finnhub candles missing for {symbol}: {data}")

    # Convert to list of rows newest-first
    rows = []
    for t, o, h, l, c, v in zip(data["t"], data["o"], data["h"], data["l"], data["c"], data["v"]):
        rows.append({
            "date": dt.datetime.fromtimestamp(t).date().isoformat(),
            "open": float(o),
            "high": float(h),
            "low": float(l),
            "close": float(c),
            "volume": float(v),
        })
    rows.sort(key=lambda x: x["date"], reverse=True)
    return rows

def compute_simple_features(prices: list[dict]) -> dict:
    if len(prices) < 6:
        return {"close": None, "ret_1d": None, "ret_5d": None}
    close0 = prices[0]["close"]
    close1 = prices[1]["close"]
    close5 = prices[5]["close"]
    return {
        "close": close0,
        "ret_1d": (close0 / close1) - 1.0,
        "ret_5d": (close0 / close5) - 1.0,
        "asof": prices[0]["date"],
    }