from __future__ import annotations

from typing import Any
import json
import httpx
from openai import OpenAI

from app.config import OPENAI_API_KEY, FINNHUB_API_KEY
from app.providers.finnhub_market import fetch_quote
from app.providers.finnhub import fetch_company_news
from app.providers.stooq import fetch_daily_closes, compute_simple_features  # <-- add this provider

client_openai = OpenAI(api_key=OPENAI_API_KEY)

async def build_research_pack(symbols: list[str]) -> dict[str, Any]:
    pack: dict[str, Any] = {}
    errors: dict[str, str] = {}

    async with httpx.AsyncClient() as http:
        for sym in symbols:
            sym = sym.strip().upper()
            if not sym:
                continue
            try:
                prices = await fetch_daily_closes(http, sym, limit=60)
                feats = compute_simple_features(prices)
                quote = await fetch_quote(http, FINNHUB_API_KEY, sym)
                news = await fetch_company_news(http, FINNHUB_API_KEY, sym, days_back=3)

                pack[sym] = {"price_features": feats, "quote": quote, "news": news}
            except Exception as e:
                errors[sym] = str(e)

    # attach errors so you can debug in response if needed
    pack["_errors"] = errors
    return pack

def llm_top_k(research_pack: dict[str, Any], k: int = 3) -> dict[str, Any]:
    # Remove internal errors from universe data
    universe = {k1: v1 for k1, v1 in research_pack.items() if k1 != "_errors"}

    system = "You are a cautious investment research assistant. Return ONLY valid JSON. No markdown."
    user = {
        "task": f"Pick exactly {k} stock symbols (from the provided universe only) for a 1-5 day horizon.",
        "constraints": [
            "Use ONLY the provided data (news + quote + simple price features).",
            "Include a clear catalyst and a clear risk per pick.",
            "Do NOT mention placing real trades; this is research only.",
            "Return JSON with keys: picks (array), market_summary (string).",
            "Each pick must have: symbol, thesis, catalyst, risk, confidence (0..1), evidence (array of short bullets).",
        ],
        "universe_data": universe,
    }

    resp = client_openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": json.dumps(user)},
        ],
        temperature=0.2,
    )

    text = resp.choices[0].message.content or "{}"
    try:
        out = json.loads(text)
    except Exception as e:
        raise RuntimeError(f"LLM did not return valid JSON. Raw:\n{text}") from e

    picks = out.get("picks", [])
    if not isinstance(picks, list) or len(picks) != k:
        raise RuntimeError(f"Expected exactly {k} picks; got: {picks}")

    allowed = set(universe.keys())
    for p in picks:
        if p.get("symbol") not in allowed:
            raise RuntimeError(f"Pick outside universe: {p.get('symbol')}")

    return out

async def generate_recommendations(symbols: list[str], k: int = 3) -> dict[str, Any]:
    research_pack = await build_research_pack(symbols)

    universe_only = {k1: v1 for k1, v1 in research_pack.items() if k1 != "_errors"}
    if len(universe_only) < k:
        return {
            "error": f"Not enough valid symbols to pick {k}.",
            "valid_universe": list(universe_only.keys()),
            "errors": research_pack.get("_errors", {}),
        }

    result = llm_top_k(research_pack, k=k)
    result["universe"] = list(universe_only.keys())
    result["errors"] = research_pack.get("_errors", {})
    return result