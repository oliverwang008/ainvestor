"use client";

import { useState } from "react";

interface RecommendationFormProps {
  onSubmit: (symbols: string[], k: number) => Promise<void>;
  loading: boolean;
}

export default function RecommendationForm({
  onSubmit,
  loading,
}: RecommendationFormProps) {
  const [symbolsInput, setSymbolsInput] = useState(
    "AAPL,TSLA,AMZN,META,NVDA,AMD,MSFT,GOOGL"
  );
  const [k, setK] = useState(3);

  const parsedSymbols = symbolsInput
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(parsedSymbols, k);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-5">
        Get recommendations
      </h2>
      <div className="space-y-5">
        <div>
          <label
            htmlFor="symbols"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Ticker universe
          </label>
          <input
            id="symbols"
            value={symbolsInput}
            onChange={(e) => setSymbolsInput(e.target.value)}
            placeholder="AAPL, TSLA, AMZN, META..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Comma-separated symbols · {parsedSymbols.length} ticker
            {parsedSymbols.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div>
          <label
            htmlFor="k"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Number of picks
          </label>
          <input
            id="k"
            type="number"
            min={1}
            max={5}
            value={k}
            onChange={(e) => setK(Number(e.target.value || 3))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading || parsedSymbols.length < k}
          className="w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-teal-600"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Getting recommendations...
            </span>
          ) : (
            "Get recommended shares"
          )}
        </button>

        {parsedSymbols.length < k && (
          <p className="text-sm text-amber-700">
            Add at least {k} symbol{k !== 1 ? "s" : ""} to get {k} pick{k !== 1 ? "s" : ""}.
          </p>
        )}
      </div>
    </form>
  );
}