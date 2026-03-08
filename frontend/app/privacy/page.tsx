import type { Metadata } from "next";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AInvestor privacy policy — how we handle your data.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2
      className="font-display text-base font-700 tracking-[0.1em] uppercase text-slate-300 mb-3 pb-2 border-b border-[#14304f]"
      style={{ fontFamily: "var(--font-barlow)", fontWeight: 700 }}
    >
      {title}
    </h2>
    <div className="space-y-3 text-sm text-[#8fb3cc] leading-relaxed">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030c18] flex flex-col">
      <SiteNav />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10">
          <h1
            className="font-display text-4xl sm:text-5xl font-800 tracking-tight text-slate-100 mb-2"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 800 }}
          >
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-[#2d5070] tracking-widest mb-3">
            EFFECTIVE DATE: MARCH 1, 2026 · OLITECH
          </p>
          <p className="text-sm text-[#5d8aaa] max-w-2xl leading-relaxed">
            We believe privacy is a right, not a feature. This policy explains what data
            AInvestor collects, how it is used, and your rights as a user.
          </p>
        </div>

        <div className="rounded-2xl border border-[#14304f] bg-[#071525] p-6 sm:p-8 space-y-0">

          <Section title="1. Who We Are">
            <p>
              AInvestor is an AI-powered investment research tool operated by{" "}
              <strong className="text-slate-800">OliTech</strong>. References to "we", "us",
              or "our" in this policy refer to OliTech and the AInvestor service.
            </p>
            <p>
              AInvestor is a research-only tool. We do not offer brokerage, investment
              advisory, or financial planning services.
            </p>
          </Section>

          <Section title="2. Data We Do Not Collect">
            <p>
              AInvestor does not require you to create an account. We do not collect:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-1 ml-2">
              <li>Your name, email address, or any contact information</li>
              <li>Payment or billing information</li>
              <li>Authentication credentials</li>
              <li>Location data</li>
              <li>Device fingerprints or persistent identifiers</li>
            </ul>
          </Section>

          <Section title="3. Data We Do Collect">
            <p>
              When you use AInvestor, the following minimal data may be processed:
            </p>
            <div className="mt-3 space-y-3">
              {[
                {
                  item: "Stock ticker symbols you search",
                  detail:
                    "The tickers you enter are transmitted to our backend API to fetch market data. They are not stored after the request completes.",
                },
                {
                  item: "API request logs",
                  detail:
                    "Our server may log basic request metadata (timestamp, HTTP method, response status) for operational monitoring. These logs do not include personally identifiable information and are retained for a maximum of 30 days.",
                },
                {
                  item: "Browser session data",
                  detail:
                    "Standard browser-level session storage may be used to maintain your selected stock universe within a single browser tab. This data is not sent to our servers and is cleared when you close the tab.",
                },
              ].map(({ item, detail }) => (
                <div key={item} className="rounded-lg border border-[#14304f] bg-[#0a1e32] px-4 py-3">
                  <p className="font-mono text-xs font-semibold text-[#00c896] mb-0.5 tracking-wide">{item}</p>
                  <p className="text-xs text-[#5d8aaa]">{detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="4. Third-Party Services">
            <p>
              AInvestor communicates with the following third-party services to operate.
              Each service has its own privacy policy governing how they handle data:
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border border-[#14304f]">
              <table className="w-full text-sm">
                <thead className="bg-[#0a1e32] border-b border-[#14304f]">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-mono text-xs tracking-widest text-[#2d5070] uppercase">Service</th>
                    <th className="text-left px-4 py-2.5 font-mono text-xs tracking-widest text-[#2d5070] uppercase">Purpose</th>
                    <th className="text-left px-4 py-2.5 font-mono text-xs tracking-widest text-[#2d5070] uppercase">Data Sent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14304f]">
                  {[
                    { service: "OpenAI", purpose: "AI analysis (GPT-4o mini)", data: "Stock ticker symbols and market data" },
                    { service: "Finnhub", purpose: "Real-time quotes & news", data: "Stock ticker symbols" },
                    { service: "Stooq", purpose: "Historical price data", data: "Stock ticker symbols" },
                    { service: "Alpha Vantage", purpose: "Supplemental market data", data: "Stock ticker symbols" },
                    { service: "Google Cloud Run", purpose: "Hosting & infrastructure", data: "Anonymised request logs" },
                  ].map(({ service, purpose, data }) => (
                    <tr key={service} className="bg-[#071525]">
                      <td className="px-4 py-2.5 font-mono text-xs font-semibold text-[#00c896] tracking-wide">{service}</td>
                      <td className="px-4 py-2.5 text-xs text-[#8fb3cc]">{purpose}</td>
                      <td className="px-4 py-2.5 text-xs text-[#5d8aaa]">{data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              We do not sell data to third parties, and we do not use your queries for
              advertising purposes.
            </p>
          </Section>

          <Section title="5. Cookies & Tracking">
            <p>
              AInvestor does not use tracking cookies, advertising cookies, or any
              third-party analytics scripts (e.g., Google Analytics). We do not run
              retargeting campaigns.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              Because we do not store personal data, there is no user data to delete or
              request. API request logs are automatically purged after 30 days. Stock
              queries submitted through the interface are not persisted beyond the duration
              of a single API call.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              AInvestor is not directed at children under the age of 13. We do not
              knowingly collect data from anyone under 13. If you believe a child has
              submitted information through our service, please contact us so we can take
              appropriate action.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>
              We may update this policy from time to time. The effective date at the top of
              this page will always reflect the date of the most recent revision. Continued
              use of AInvestor after any changes constitutes acceptance of the updated
              policy.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              If you have questions about this privacy policy or how your data is handled,
              please reach out to us at{" "}
              <strong className="text-slate-800">OliTech</strong> through the AInvestor
              website. We aim to respond to all privacy enquiries within 5 business days.
            </p>
          </Section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
