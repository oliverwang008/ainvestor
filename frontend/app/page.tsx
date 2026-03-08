"use client";

import { useState } from "react";
import RecommendationForm from "@/components/recommendation-form";
import MarketSummary from "@/components/market-summary";
import PicksGrid from "@/components/picks-grid";
import ProviderErrors from "@/components/provider-errors";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import { fetchRecommendations } from "@/lib/api";
import { RecommendationResponse } from "@/lib/types";

const STEPS = [
  {
    num: "01",
    title: "Build Your Universe",
    body: "Search by ticker or company name. Add any stocks you want in the analysis — you control the scope.",
  },
  {
    num: "02",
    title: "Live Data, Instantly",
    body: "Real-time quotes, 3-day news feed, and 60-day price history fetched for every ticker the moment you submit.",
  },
  {
    num: "03",
    title: "Ranked with Rationale",
    body: "GPT-4o mini returns your top picks ranked by conviction — each with thesis, catalyst, risk, and confidence.",
  },
];

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
    <div className="min-h-screen flex flex-col bg-[#030c18]">
      <SiteNav />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-[#14304f] hero-grid">
        {/* Radial glow behind headline */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% -10%, rgba(0,200,150,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-12 sm:px-6 lg:px-8">
          {/* Label */}
          <div className="flex items-center gap-2 mb-5">
            <span className="h-px w-8 bg-[#00c896]" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#00c896] uppercase">
              AI Investment Research
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-none tracking-tight text-slate-100 mb-5"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 800 }}
          >
            YOUR AI
            <span className="block text-[#00c896] ticker-glow">
              INVESTMENT ADVISOR
            </span>
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-[#5d8aaa] mb-10">
            Institutional-grade AI research for individual investors. Select your watchlist,
            pull live market data, and receive ranked picks with clear rationale — powered
            by GPT-4o mini.
          </p>

          {/* 3-step cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            {STEPS.map(({ num, title, body }) => (
              <div
                key={num}
                className="rounded-xl border border-[#14304f] bg-[#071525]/80 p-4 hover:border-[#1e4d7a] transition-colors"
              >
                <span
                  className="font-display text-3xl font-800 text-[#14304f] leading-none select-none"
                  style={{ fontFamily: "var(--font-barlow)", fontWeight: 800 }}
                >
                  {num}
                </span>
                <p className="mt-2 text-xs font-semibold tracking-wider uppercase text-[#00c896]">
                  {title}
                </p>
                <p className="mt-1 text-xs text-[#5d8aaa] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">

          {/* Left — form */}
          <aside className="space-y-4">
            <RecommendationForm
              onSubmit={handleGetRecommendations}
              loading={loading}
            />
            {error && (
              <div
                className="rounded-xl border border-red-900/60 bg-red-950/50 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                {error}
              </div>
            )}
          </aside>

          {/* Right — results */}
          <div className="space-y-5 min-w-0">
            {!data ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#14304f] bg-[#071525]/50 p-20 text-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-[#14304f] bg-[#0a1e32] mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-6 text-[#2d5070]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                </div>
                <p className="font-display text-base font-600 text-[#5d8aaa] tracking-wide uppercase"
                   style={{ fontFamily: "var(--font-barlow)", fontWeight: 600 }}>
                  Awaiting Analysis
                </p>
                <p className="mt-1.5 text-xs text-[#2d5070] max-w-xs leading-relaxed">
                  Add stocks to your universe, select the number of picks, and run the analysis.
                </p>
              </div>
            ) : (
              <>
                {data.market_summary && <MarketSummary summary={data.market_summary} />}
                {data.picks && <PicksGrid picks={data.picks} />}
                <ProviderErrors errors={data.errors} />
              </>
            )}
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
