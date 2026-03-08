import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AInvestor — AI-Powered Stock Recommendations & Market Analysis",
    template: "%s | AInvestor",
  },
  description:
    "AInvestor uses GPT-4o mini to rank stocks from your watchlist using live quotes, recent news, and 60-day price trends. Get institutional-grade AI investment research in seconds — free.",
  keywords: [
    "AI stock recommendations",
    "AI stock picker",
    "AI investing tool",
    "stock analysis AI",
    "GPT stock picks",
    "live stock data analysis",
    "investment research tool",
    "stock market AI",
    "algorithmic stock analysis",
    "AI portfolio research",
    "stock screener AI",
    "GPT-4 stock analysis",
  ],
  authors: [{ name: "OliTech" }],
  creator: "OliTech",
  publisher: "OliTech",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    title: "AInvestor — AI-Powered Stock Recommendations",
    description:
      "Build a watchlist, let AI fetch live market data, and get ranked stock picks with thesis, catalyst, and risk — powered by GPT-4o mini.",
    siteName: "AInvestor by OliTech",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AInvestor — AI-Powered Stock Recommendations",
    description:
      "Build a watchlist, let AI fetch live market data, and get ranked stock picks with thesis, catalyst, and risk — powered by GPT-4o mini.",
    creator: "@OliTech",
  },
  alternates: {
    canonical: "https://ainvestor-frontend-992434720520.us-central1.run.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${barlowCondensed.variable} antialiased bg-[#030c18] text-slate-200`}
      >
        {children}
      </body>
    </html>
  );
}
