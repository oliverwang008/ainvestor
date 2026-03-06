interface ProviderErrorsProps {
  errors?: Record<string, string>;
}

export default function ProviderErrors({ errors = {} }: ProviderErrorsProps) {
  const entries = Object.entries(errors);

  return (
    <section className="rounded-2xl border p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Provider errors</h2>

      {!entries.length ? (
        <p className="text-gray-500">No provider errors reported.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([symbol, message]) => (
            <div key={symbol} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="font-medium">{symbol}</p>
              <p className="text-sm text-gray-700 mt-1">{message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}