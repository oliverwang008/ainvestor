interface MarketSummaryProps {
  summary: string;
}

export default function MarketSummary({ summary }: MarketSummaryProps) {
  return (
    <section
      className="rounded-2xl border border-[#14304f] bg-[#071525] overflow-hidden"
      aria-labelledby="market-summary-heading"
    >
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#14304f]">
        <span className="size-1.5 rounded-full bg-[#00c896]" />
        <h2
          id="market-summary-heading"
          className="font-display text-xs font-700 tracking-[0.15em] uppercase text-slate-400"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 700 }}
        >
          Market Summary
        </h2>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm text-[#8fb3cc] leading-relaxed">{summary}</p>
      </div>
    </section>
  );
}
