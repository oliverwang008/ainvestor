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

const CONF = {
  high: {
    accent: "#00c896",
    accentDim: "rgba(0,200,150,0.12)",
    accentBorder: "rgba(0,200,150,0.25)",
    label: "HIGH",
    barColor: "#00c896",
    textColor: "text-[#00c896]",
    bgBadge: "bg-[#00c896]/10 border-[#00c896]/20 text-[#00c896]",
  },
  medium: {
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.2)",
    label: "MEDIUM",
    barColor: "#f59e0b",
    textColor: "text-amber-400",
    bgBadge: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  },
  low: {
    accent: "#475569",
    accentDim: "rgba(71,85,105,0.08)",
    accentBorder: "rgba(71,85,105,0.2)",
    label: "LOW",
    barColor: "#475569",
    textColor: "text-slate-500",
    bgBadge: "bg-slate-700/30 border-slate-600/30 text-slate-500",
  },
};

export default function PicksGrid({ picks = [] }: PicksGridProps) {
  return (
    <section aria-labelledby="picks-heading">
      <div className="flex items-center gap-3 mb-4">
        <h2
          id="picks-heading"
          className="font-display text-xs font-700 tracking-[0.15em] uppercase text-slate-400"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 700 }}
        >
          Top Picks
        </h2>
        <span className="text-xs font-mono text-[#2d5070]">
          {picks.length} result{picks.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3">
        {picks.map((pick, rank) => {
          const level = confidenceLevel(pick.confidence);
          const conf = CONF[level];

          return (
            <article
              key={pick.symbol}
              className="rounded-2xl border border-[#14304f] bg-[#071525] overflow-hidden animate-fade-up transition-shadow hover:border-[#1e4d7a]"
              style={{ animationDelay: `${rank * 60}ms` }}
            >
              {/* ── Card header ── */}
              <div
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-[#14304f]"
                style={{ background: conf.accentDim }}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <span className="font-mono text-xs text-[#2d5070] w-5 shrink-0">
                    #{rank + 1}
                  </span>
                  {/* Ticker */}
                  <h3
                    className={`font-mono text-2xl font-bold tracking-widest ticker-glow ${conf.textColor}`}
                  >
                    {pick.symbol}
                  </h3>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                  {/* Confidence bar */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-20 h-1 rounded-full bg-[#14304f] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: toPercent(pick.confidence), backgroundColor: conf.barColor }}
                      />
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      {toPercent(pick.confidence)}
                    </span>
                  </div>
                  {/* Badge */}
                  <span className={`rounded border px-2.5 py-0.5 font-mono text-xs tracking-wider ${conf.bgBadge}`}>
                    {conf.label}
                  </span>
                </div>
              </div>

              {/* ── Body: Thesis / Catalyst / Risk ── */}
              <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#14304f]">
                {[
                  { label: "Thesis", text: pick.thesis },
                  { label: "Catalyst", text: pick.catalyst },
                  { label: "Risk", text: pick.risk },
                ].map(({ label, text }) => (
                  <div key={label} className="px-5 py-4">
                    <p className="font-mono text-xs tracking-[0.15em] uppercase text-[#2d5070] mb-2">
                      {label}
                    </p>
                    <p className="text-sm text-[#8fb3cc] leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              {/* ── Evidence ── */}
              {pick.evidence?.length > 0 && (
                <div className="px-5 py-3.5 border-t border-[#14304f] bg-[#030c18]/40">
                  <p className="font-mono text-xs tracking-[0.15em] uppercase text-[#2d5070] mb-2.5">
                    Evidence
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {pick.evidence.map((item, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-[#14304f] bg-[#0a1e32] px-3 py-1.5 text-xs text-[#5d8aaa] leading-relaxed"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
