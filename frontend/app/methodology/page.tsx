import type { Metadata } from "next";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Data & Methodology",
  description:
    "Learn how AInvestor sources live financial data and how the AI makes stock recommendations.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2
      className="font-display text-lg font-700 tracking-[0.1em] uppercase text-slate-300 mb-4 pb-2 border-b border-[#14304f]"
      style={{ fontFamily: "var(--font-barlow)", fontWeight: 700 }}
    >
      {title}
    </h2>
    <div className="space-y-3 text-sm text-[#8fb3cc] leading-relaxed">{children}</div>
  </section>
);

const SourceCard = ({
  name,
  url,
  description,
  dataTypes,
}: {
  name: string;
  url: string;
  description: string;
  dataTypes: string[];
}) => (
  <div className="rounded-2xl border border-[#14304f] bg-[#0a1e32] p-5">
    <div className="flex items-start justify-between gap-4 mb-2">
      <p className="font-mono text-sm font-semibold text-slate-200 tracking-wide">{name}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-mono text-[#00c896] hover:underline shrink-0"
      >
        {url.replace("https://", "")}
      </a>
    </div>
    <p className="text-xs text-[#5d8aaa] mb-3 leading-relaxed">{description}</p>
    <div className="flex flex-wrap gap-2">
      {dataTypes.map((t) => (
        <span
          key={t}
          className="rounded border border-[#00c896]/20 bg-[#00c896]/10 px-2.5 py-0.5 text-xs font-mono text-[#00c896]"
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#030c18] flex flex-col">
      <SiteNav />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10">
          <h1
            className="font-display text-4xl sm:text-5xl font-800 tracking-tight text-slate-100 mb-3"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 800 }}
          >
            Data &amp; Methodology
          </h1>
          <p className="mt-3 text-sm text-[#5d8aaa] max-w-2xl leading-relaxed">
            AInvestor combines live market data from multiple financial APIs with a large
            language model to generate research-grade stock analysis. This page explains exactly
            what data we use, where it comes from, and how the AI reaches its conclusions.
          </p>
        </div>

        {/* Data sources */}
        <Section title="Data Sources">
          <p>
            For each ticker in your universe, AInvestor fetches three categories of data in
            real time before passing anything to the AI. No historical snapshots are used —
            every analysis reflects the latest available market information at the moment you
            submit a request.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <SourceCard
              name="Finnhub"
              url="https://finnhub.io"
              description="Provides real-time stock quotes (last price, open, high, low, volume, percent change) and company news headlines from the past 3 days."
              dataTypes={["Real-time quote", "Company news", "Sentiment"]}
            />
            <SourceCard
              name="Stooq"
              url="https://stooq.com"
              description="Supplies 60-day daily OHLCV (open, high, low, close, volume) price history used to compute momentum and volatility features."
              dataTypes={["60-day OHLCV history", "Price trend"]}
            />
            <SourceCard
              name="Alpha Vantage"
              url="https://www.alphavantage.co"
              description="Used as a supplemental fundamental data source for additional price and indicator information where applicable."
              dataTypes={["Supplemental price data"]}
            />
            <SourceCard
              name="OpenAI GPT-4o mini"
              url="https://platform.openai.com"
              description="The large language model that synthesises all fetched data, reasons about the investment case for each ticker, and ranks the universe."
              dataTypes={["AI reasoning", "Natural language output"]}
            />
          </div>
        </Section>

        {/* Features computed */}
        <Section title="Features Computed from Price History">
          <p>
            Before the data is sent to the AI, we compute a small set of quantitative
            features from the 60-day OHLCV data to give the model a structured, numerical
            view of recent price behaviour:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              {
                name: "Simple return (1-day, 5-day, 20-day)",
                desc: "Percentage change in closing price over the trailing 1, 5, and 20 trading days, giving the AI short and medium-term momentum signals.",
              },
              {
                name: "Realised volatility",
                desc: "Annualised standard deviation of daily log-returns over the trailing 20 days, measuring how much the stock has been moving.",
              },
              {
                name: "Average daily volume",
                desc: "Mean daily traded volume over 20 days. High-volume moves carry more weight than thin-volume moves.",
              },
              {
                name: "Price relative to 20-day range",
                desc: "Where the current price sits within its recent high–low band (0 = at 20-day low, 1 = at 20-day high).",
              },
            ].map(({ name, desc }) => (
              <li key={name} className="rounded-lg border border-[#14304f] bg-[#0a1e32] px-4 py-3">
                <p className="font-mono text-xs font-semibold text-[#00c896] mb-0.5 tracking-wide">{name}</p>
                <p className="text-xs text-[#5d8aaa]">{desc}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* AI decision process */}
        <Section title="How the AI Makes Decisions">
          <p>
            Once all data is collected, it is serialised into a structured JSON payload and
            sent to <strong className="text-slate-800">GPT-4o mini</strong> with a carefully
            designed system prompt. The model is instructed to:
          </p>
          <ol className="mt-3 space-y-2 list-decimal list-inside">
            {[
              "Use only the provided data — no hallucinated facts or outside knowledge about current events.",
              "Consider each stock's price features (momentum, volatility), real-time quote (current price, daily change), and recent news headlines together.",
              "Identify a clear investment catalyst — a specific reason why the stock may move over the next 1–5 trading days.",
              "Identify the primary risk that could invalidate the thesis.",
              "Assign a confidence score (0–1) reflecting how strong and consistent the evidence is.",
              "Return exactly the requested number of picks, strictly from the tickers provided — no additions or substitutions.",
            ].map((step, i) => (
              <li key={i} className="text-[#8fb3cc]">
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-4">
            The model temperature is set to <code className="text-xs bg-[#0a1e32] border border-[#14304f] px-1.5 py-0.5 rounded font-mono text-[#00c896]">0.2</code> to
            keep outputs focused and reproducible. The prompt explicitly forbids the model from
            recommending trades or providing financial advice.
          </p>
        </Section>

        {/* Limitations */}
        <Section title="Limitations & Important Caveats">
          <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 space-y-2">
            {[
              "AInvestor is a research tool, not a trading system. Output should be treated as one data point in a broader research process.",
              "AI language models can hallucinate or make errors. Always verify key claims independently before making any investment decision.",
              "Short-term price prediction is inherently uncertain. A strong thesis and catalyst do not guarantee positive returns.",
              "The model only sees data for the tickers in your universe. It cannot account for macro events, earnings surprises, or news that broke after the data was fetched.",
              "Data latency: quotes and news are fetched at the moment of your request. There may be a delay of a few minutes relative to the live market.",
              "This tool does not hold, manage, or recommend any portfolio. It is not registered as an investment adviser.",
            ].map((point, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="mt-0.5 shrink-0 text-amber-500">⚠</span>
                <p className="text-sm text-slate-700">{point}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
