interface MarketSummaryProps {
  summary?: string;
}

export default function MarketSummary({ summary }: MarketSummaryProps) {
  const isEmpty = !summary?.trim();

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5"
      aria-labelledby="market-summary-heading"
    >
      <h2
        id="market-summary-heading"
        className="text-lg font-semibold text-slate-900 mb-4"
      >
        Market summary
      </h2>
      {isEmpty ? (
        <p className="text-slate-500 text-sm leading-relaxed">
          Run a query to see an AI-generated market summary.
        </p>
      ) : (
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {summary}
        </p>
      )}
    </section>
  );
}