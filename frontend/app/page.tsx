"use client";

import { useState } from "react";
import RecommendationForm from "@/components/recommendation-form";
import MarketSummary from "@/components/market-summary";
import PicksGrid from "@/components/picks-grid";
import ProviderErrors from "@/components/provider-errors";
import { fetchRecommendations } from "@/lib/api";
import { RecommendationResponse } from "@/lib/types";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState("");

  async function handleGetRecommendations(symbols: string[], k: number) {
    setLoading(true);
    setError("");

    try {
      const result = await fetchRecommendations(symbols, k);
      setData(result);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">AInvestor</h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            AI-powered stock recommendations using live backend data.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            <RecommendationForm
              onSubmit={handleGetRecommendations}
              loading={loading}
            />

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <MarketSummary summary={data?.market_summary} />
            <PicksGrid picks={data?.picks} />
            <ProviderErrors errors={data?.errors} />
          </div>
        </div>
      </div>
    </main>
  );
}