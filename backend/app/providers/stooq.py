from __future__ import annotations
import csv
import io
import httpx

def _to_stooq_symbol(sym: str) -> str:
    # US tickers need ".us" on Stooq
    return f"{sym.lower()}.us"

async def fetch_daily_closes(client: httpx.AsyncClient, symbol: str, limit: int = 60) -> list[dict]:
    s = _to_stooq_symbol(symbol)
    url = f"https://stooq.com/q/d/l/?s={s}&i=d"  # daily CSV
    r = await client.get(url, timeout=30)
    r.raise_for_status()

    text = r.text.strip()
    if "Date,Open,High,Low,Close,Volume" not in text:
        raise RuntimeError(f"Stooq returned unexpected data for {symbol}")

    rows = list(csv.DictReader(io.StringIO(text)))
    # newest last in Stooq; convert to newest-first
    out = []
    for row in rows[-limit:]:
        out.append({
            "date": row["Date"],
            "close": float(row["Close"]),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "volume": float(row["Volume"]) if row.get("Volume") else None,
        })
    out.sort(key=lambda x: x["date"], reverse=True)
    return out

def compute_simple_features(prices: list[dict]) -> dict:
    if len(prices) < 6:
        return {"close": None, "ret_1d": None, "ret_5d": None}
    c0 = prices[0]["close"]
    c1 = prices[1]["close"]
    c5 = prices[5]["close"]
    return {"close": c0, "ret_1d": (c0 / c1) - 1.0, "ret_5d": (c0 / c5) - 1.0, "asof": prices[0]["date"]}