import { RecommendationResponse } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

const RECOMMEND_TIMEOUT_MS = 120_000; // 2 min — backend may call LLM + many APIs

export async function fetchRecommendations(
  symbols: string[],
  k: number
): Promise<RecommendationResponse> {
  const params = new URLSearchParams();
  symbols.forEach((symbol) => {
    params.append("symbols", symbol.trim().toUpperCase());
  });
  params.append("k", String(k));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), RECOMMEND_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(
      `${API_BASE}/recommendations?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      }
    );
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new Error("Request timed out. The analysis may take a minute—try again.");
      }
      // CORS or network failure often surfaces as "Failed to fetch"
      throw new Error(
        err.message === "Failed to fetch"
          ? "Cannot reach the API. Check that the backend is running and CORS allows this origin."
          : err.message
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  let data: RecommendationResponse;
  try {
    data = (await res.json()) as RecommendationResponse;
  } catch {
    throw new Error("Invalid JSON response from API");
  }

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch recommendations");
  }

  return data;
}