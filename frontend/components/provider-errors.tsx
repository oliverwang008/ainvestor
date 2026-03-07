interface ProviderErrorsProps {
  errors?: Record<string, string>;
}

export default function ProviderErrors({ errors = {} }: ProviderErrorsProps) {
  const entries = Object.entries(errors);

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5"
      aria-labelledby="provider-errors-heading"
    >
      <h2
        id="provider-errors-heading"
        className="text-lg font-semibold text-slate-900 mb-4"
      >
        Provider errors
      </h2>

      {!entries.length ? (
        <p className="text-slate-500 text-sm">
          No provider errors reported.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map(([symbol, message]) => (
            <div
              key={symbol}
              className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2.5"
            >
              <p className="font-medium text-slate-900">{symbol}</p>
              <p className="text-sm text-slate-600 mt-0.5">{message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}