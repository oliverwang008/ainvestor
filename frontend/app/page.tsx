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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            AInvestor
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            AI-powered stock recommendations using live market data.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <aside className="space-y-5">
            <RecommendationForm
              onSubmit={handleGetRecommendations}
              loading={loading}
            />

            {error && (
              <div
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm"
                role="alert"
              >
                {error}
              </div>
            )}
          </aside>

          <div className="space-y-8">
            <MarketSummary summary={data?.market_summary} />
            <PicksGrid picks={data?.picks} />
            <ProviderErrors errors={data?.errors} />
          </div>
        </div>
      </div>
    </main>
  );
}