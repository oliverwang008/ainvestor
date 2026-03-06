import { Pick } from "@/lib/types";

interface PicksGridProps {
  picks?: Pick[];
}

function toPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function PicksGrid({ picks = [] }: PicksGridProps) {
  if (!picks.length) {
    return (
      <section className="rounded-2xl border p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Top picks</h2>
        <p className="text-gray-500">No recommendations yet.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Top picks</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {picks.map((pick) => (
          <div key={pick.symbol} className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">{pick.symbol}</h3>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {toPercent(pick.confidence)}
              </span>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="font-medium text-black mb-1">Thesis</p>
                <p>{pick.thesis}</p>
              </div>

              <div>
                <p className="font-medium text-black mb-1">Catalyst</p>
                <p>{pick.catalyst}</p>
              </div>

              <div>
                <p className="font-medium text-black mb-1">Risk</p>
                <p>{pick.risk}</p>
              </div>

              <div>
                <p className="font-medium text-black mb-2">Evidence</p>
                <ul className="space-y-2">
                  {pick.evidence.map((item, index) => (
                    <li key={index} className="rounded-xl bg-gray-50 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}