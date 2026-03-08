interface ProviderErrorsProps {
  errors?: Record<string, string>;
}

export default function ProviderErrors({ errors = {} }: ProviderErrorsProps) {
  const entries = Object.entries(errors);
  if (!entries.length) return null;

  return (
    <section
      className="rounded-2xl border border-amber-900/40 bg-amber-950/20 overflow-hidden"
      aria-labelledby="provider-errors-heading"
    >
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-amber-900/30">
        <span className="size-1.5 rounded-full bg-amber-400" />
        <h2
          id="provider-errors-heading"
          className="font-display text-xs font-700 tracking-[0.15em] uppercase text-amber-500/80"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 700 }}
        >
          Data Warnings
        </h2>
      </div>
      <div className="p-4 space-y-2">
        {entries.map(([symbol, message]) => (
          <div
            key={symbol}
            className="rounded-lg border border-amber-900/30 bg-[#0a1e32] px-4 py-2.5"
          >
            <p className="font-mono text-xs font-semibold text-amber-400 tracking-wider mb-0.5">
              {symbol}
            </p>
            <p className="text-xs text-[#5d8aaa]">{message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
