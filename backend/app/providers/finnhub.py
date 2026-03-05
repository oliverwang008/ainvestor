from __future__ import annotations
import datetime as dt
import httpx

FINNHUB_BASE = "https://finnhub.io/api/v1"

async def fetch_company_news(client: httpx.AsyncClient, api_key: str, symbol: str, days_back: int = 3) -> list[dict]:
    # /company-news?symbol=AAPL&from=YYYY-MM-DD&to=YYYY-MM-DD&token=...
    to_date = dt.date.today()
    from_date = to_date - dt.timedelta(days=days_back)

    params = {
        "symbol": symbol,
        "from": from_date.isoformat(),
        "to": to_date.isoformat(),
        "token": api_key,
    }
    r = await client.get(f"{FINNHUB_BASE}/company-news", params=params, timeout=30)
    r.raise_for_status()
    items = r.json()
    if not isinstance(items, list):
        raise RuntimeError(f"Finnhub company-news unexpected response for {symbol}: {items}")

    # Keep it small for prompt
    items = sorted(items, key=lambda x: x.get("datetime", 0), reverse=True)[:8]
    cleaned = []
    for it in items:
        cleaned.append({
            "headline": it.get("headline"),
            "source": it.get("source"),
            "url": it.get("url"),
            "datetime": it.get("datetime"),
            "summary": it.get("summary")[:400] if it.get("summary") else None,
        })
    return cleaned