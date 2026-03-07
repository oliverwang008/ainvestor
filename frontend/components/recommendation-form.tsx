"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { searchStocks, Stock } from "@/lib/stocks";

interface RecommendationFormProps {
  onSubmit: (symbols: string[], k: number) => Promise<void>;
  loading: boolean;
}

export default function RecommendationForm({
  onSubmit,
  loading,
}: RecommendationFormProps) {
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addSymbol = useCallback(
    (stock: Stock) => {
      if (!selected.find((s) => s.ticker === stock.ticker)) {
        setSelected((prev) => [...prev, stock]);
      }
      setQuery("");
      setSuggestions([]);
      inputRef.current?.focus();
    },
    [selected]
  );

  const removeSymbol = useCallback((ticker: string) => {
    setSelected((prev) => prev.filter((s) => s.ticker !== ticker));
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = highlightedIndex >= 0 ? suggestions[highlightedIndex] : suggestions[0];
      if (target) addSymbol(target);
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 0) return;
    await onSubmit(selected.map((s) => s.ticker), effectiveK);
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
        {/* Symbol search input */}
        <div>
          <label
            htmlFor="symbol-search"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Add stocks to universe
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="symbol-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setSuggestions(searchStocks(query))}
              placeholder="Search ticker or company name…"
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />

            {/* Dropdown */}
            {suggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden"
              >
                {suggestions.map((stock, i) => {
                  const alreadyAdded = selected.some((s) => s.ticker === stock.ticker);
                  return (
                    <button
                      key={stock.ticker}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addSymbol(stock);
                      }}
                      className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors ${
                        i === highlightedIndex
                          ? "bg-teal-50"
                          : "hover:bg-slate-50"
                      } ${alreadyAdded ? "opacity-40 cursor-default" : ""}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900 w-16 shrink-0">
                          {stock.ticker}
                        </span>
                        <span className="text-slate-500 truncate">{stock.name}</span>
                      </span>
                      {alreadyAdded && (
                        <span className="text-xs text-slate-400 ml-2 shrink-0">added</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected symbols list */}
        {selected.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Universe ({selected.length} stock{selected.length !== 1 ? "s" : ""})
            </p>
            <ul className="space-y-1.5">
              {selected.map((stock) => (
                <li
                  key={stock.ticker}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-slate-900">{stock.ticker}</span>
                    <span className="text-xs text-slate-500 truncate">{stock.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSymbol(stock.ticker)}
                    aria-label={`Remove ${stock.ticker}`}
                    className="ml-2 shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 20 20" fill="currentColor">
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
            max={maxK || 5}
            value={effectiveK}
            onChange={(e) => setK(Number(e.target.value) || 1)}
            disabled={selected.length === 0}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
          />
          {selected.length > 0 && (
            <p className="mt-1.5 text-xs text-slate-500">
              Max {maxK} (limited to 5 or your universe size)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || selected.length === 0 || effectiveK < 1}
          className="w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-teal-600"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Getting recommendations…
            </span>
          ) : (
            "Get recommended shares"
          )}
        </button>

        {selected.length === 0 && (
          <p className="text-sm text-slate-500 text-center">
            Search and add at least one stock to get started.
          </p>
        )}
      </div>
    </form>
  );
}
