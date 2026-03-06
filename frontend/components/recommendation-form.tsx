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
    <form onSubmit={handleSubmit} className="rounded-2xl border p-6 space-y-4 bg-white shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-2">Ticker universe</label>
        <input
          value={symbolsInput}
          onChange={(e) => setSymbolsInput(e.target.value)}
          placeholder="AAPL,TSLA,AMZN"
          className="w-full rounded-xl border px-4 py-3"
        />
        <p className="mt-2 text-sm text-gray-500">
          Comma-separated symbols. Current count: {parsedSymbols.length}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Number of picks</label>
        <input
          type="number"
          min={1}
          max={5}
          value={k}
          onChange={(e) => setK(Number(e.target.value || 3))}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <button
        type="submit"
        disabled={loading || parsedSymbols.length < k}
        className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Loading..." : "Retrieve recommended shares"}
      </button>

      {parsedSymbols.length < k && (
        <p className="text-sm text-amber-600">
          Add more symbols than the number of picks requested.
        </p>
      )}
    </form>
  );
}