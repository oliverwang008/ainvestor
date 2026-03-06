interface MarketSummaryProps {
  summary?: string;
}

export default function MarketSummary({ summary }: MarketSummaryProps) {
  return (
    <section className="rounded-2xl border p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Market summary</h2>
      <p className="text-gray-700 leading-7">
        {summary || "Run a query to view the market summary."}
      </p>
    </section>
  );
}