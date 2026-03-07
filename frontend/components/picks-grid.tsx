import { Pick } from "@/lib/types";

interface PicksGridProps {
  picks?: Pick[];
}

function toPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function confidenceLevel(confidence: number) {
  if (confidence >= 0.7) return "high";
  if (confidence >= 0.4) return "medium";
  return "low";
}

export default function PicksGrid({ picks = [] }: PicksGridProps) {
  if (!picks.length) {
    return (
      <section
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5"
        aria-labelledby="picks-heading"
      >
        <h2
          id="picks-heading"
          className="text-lg font-semibold text-slate-900 mb-3"
        >
          Top picks
        </h2>
        <p className="text-slate-500 text-sm">
          No recommendations yet. Submit a query to see AI-selected picks.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="picks-heading">
      <h2
        id="picks-heading"
        className="text-lg font-semibold text-slate-900 mb-4"
      >
        Top picks
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {picks.map((pick) => {
          const level = confidenceLevel(pick.confidence);
          const badgeClass =
            level === "high"
              ? "bg-teal-100 text-teal-800"
              : level === "medium"
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-700";

          return (
            <article
              key={pick.symbol}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                  {pick.symbol}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass}`}
                >
                  {toPercent(pick.confidence)} confidence
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-slate-900 mb-1">Thesis</p>
                  <p className="text-slate-600 leading-relaxed">{pick.thesis}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900 mb-1">Catalyst</p>
                  <p className="text-slate-600 leading-relaxed">
                    {pick.catalyst}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-900 mb-1">Risk</p>
                  <p className="text-slate-600 leading-relaxed">{pick.risk}</p>
                </div>
                {pick.evidence?.length > 0 && (
                  <div>
                    <p className="font-medium text-slate-900 mb-2">Evidence</p>
                    <ul className="space-y-2">
                      {pick.evidence.map((item, index) => (
                        <li
                          key={index}
                          className="rounded-lg bg-slate-50 px-3 py-2 text-slate-600 leading-relaxed"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}