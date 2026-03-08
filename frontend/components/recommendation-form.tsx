"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { searchStocks, Stock } from "@/lib/stocks";

interface RecommendationFormProps {
  onSubmit: (symbols: string[], k: number) => Promise<void>;
  loading: boolean;
}

export default function RecommendationForm({ onSubmit, loading }: RecommendationFormProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selected, setSelected] = useState<Stock[]>([]);
  const [k, setK] = useState(3);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const maxK = Math.min(5, selected.length);
  const effectiveK = Math.min(k, maxK);

  useEffect(() => {
    setSuggestions(searchStocks(query));
    setHighlightedIndex(-1);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addSymbol = useCallback((stock: Stock) => {
    if (!selected.find((s) => s.ticker === stock.ticker)) {
      setSelected((prev) => [...prev, stock]);
    }
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  }, [selected]);

  const removeSymbol = useCallback((ticker: string) => {
    setSelected((prev) => prev.filter((s) => s.ticker !== ticker));
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const target = highlightedIndex >= 0 ? suggestions[highlightedIndex] : suggestions[0];
      if (target) addSymbol(target);
    } else if (e.key === "Escape") setSuggestions([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected.length) return;
    await onSubmit(selected.map((s) => s.ticker), effectiveK);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#14304f] bg-[#071525] overflow-hidden"
    >
      {/* Form header */}
      <div className="px-5 py-4 border-b border-[#14304f] flex items-center justify-between">
        <h2
          className="font-display text-sm font-700 tracking-[0.12em] uppercase text-slate-300"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 700 }}
        >
          Stock Universe
        </h2>
        {selected.length > 0 && (
          <span className="font-mono text-xs text-[#00c896]">
            {selected.length} selected
          </span>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Search input */}
        <div>
          <label htmlFor="symbol-search" className="block text-xs font-mono tracking-widest uppercase text-[#2d5070] mb-2">
            Search Ticker / Company
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <svg className="size-3.5 text-[#2d5070]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              id="symbol-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setSuggestions(searchStocks(query))}
              placeholder="AAPL, Tesla, Nvidia…"
              autoComplete="off"
              className="w-full rounded-lg border border-[#14304f] bg-[#0a1e32] pl-9 pr-3.5 py-2.5 text-sm text-slate-200 placeholder:text-[#2d5070] font-mono tracking-wide focus:border-[#00c896] focus:outline-none focus:ring-1 focus:ring-[#00c896]/30 transition-colors"
            />

            {/* Dropdown */}
            {suggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-20 mt-1 w-full rounded-xl border border-[#14304f] bg-[#0a1e32] shadow-2xl overflow-hidden"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}
              >
                {suggestions.map((stock, i) => {
                  const alreadyAdded = selected.some((s) => s.ticker === stock.ticker);
                  return (
                    <button
                      key={stock.ticker}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); addSymbol(stock); }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors border-b border-[#14304f] last:border-0 ${
                        i === highlightedIndex ? "bg-[#00c896]/10" : "hover:bg-[#0f2540]"
                      } ${alreadyAdded ? "opacity-40 cursor-default" : ""}`}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-semibold text-[#00c896] w-14 shrink-0 tracking-wider">
                          {stock.ticker}
                        </span>
                        <span className="text-xs text-[#5d8aaa] truncate">{stock.name}</span>
                      </span>
                      {alreadyAdded && (
                        <span className="text-xs text-[#2d5070] ml-2 shrink-0 font-mono">added</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected list */}
        {selected.length > 0 && (
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-[#2d5070] mb-2">
              Universe — {selected.length} ticker{selected.length !== 1 ? "s" : ""}
            </p>
            <ul className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
              {selected.map((stock) => (
                <li
                  key={stock.ticker}
                  className="flex items-center justify-between rounded-lg border border-[#14304f] bg-[#0a1e32] px-3 py-2 group"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#00c896] tracking-wider w-14 shrink-0">
                      {stock.ticker}
                    </span>
                    <span className="text-xs text-[#5d8aaa] truncate">{stock.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSymbol(stock.ticker)}
                    aria-label={`Remove ${stock.ticker}`}
                    className="ml-2 shrink-0 rounded p-0.5 text-[#2d5070] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Number of picks */}
        <div>
          <label htmlFor="k" className="block text-xs font-mono tracking-widest uppercase text-[#2d5070] mb-2">
            Picks to Return
          </label>
          <div className="relative">
            <select
              id="k"
              value={effectiveK}
              onChange={(e) => setK(Number(e.target.value))}
              disabled={!selected.length}
              className="w-full appearance-none rounded-lg border border-[#14304f] bg-[#0a1e32] px-3.5 py-2.5 pr-9 text-sm font-mono text-slate-200 focus:border-[#00c896] focus:outline-none focus:ring-1 focus:ring-[#00c896]/30 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              {!selected.length ? (
                <option value={1}>— add stocks first —</option>
              ) : (
                Array.from({ length: maxK }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} pick{n !== 1 ? "s" : ""}</option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#2d5070]">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !selected.length || effectiveK < 1}
          className="w-full rounded-lg border border-[#00c896]/50 bg-[#00c896]/10 px-4 py-3 text-sm font-display font-700 tracking-[0.1em] uppercase text-[#00c896] transition-all hover:bg-[#00c896]/20 hover:border-[#00c896] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[#00c896]/10"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 700 }}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2.5">
              <span className="size-3.5 animate-spin rounded-full border-2 border-[#00c896]/30 border-t-[#00c896]" />
              Analysing…
            </span>
          ) : (
            "Run Analysis →"
          )}
        </button>

        {!selected.length && (
          <p className="text-xs text-[#2d5070] text-center font-mono">
            Search and add at least one ticker to begin.
          </p>
        )}
      </div>
    </form>
  );
}
