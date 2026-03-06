import { RecommendationResponse } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export async function fetchRecommendations(
  symbols: string[],
  k: number
): Promise<RecommendationResponse> {
  const params = new URLSearchParams();

  symbols.forEach((symbol) => {
    params.append("symbols", symbol.trim().toUpperCase());
  });
  params.append("k", String(k));

  const res = await fetch(`${API_BASE}/recommendations?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = (await res.json()) as RecommendationResponse;

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch recommendations");
  }

  return data;
}