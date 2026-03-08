import Link from "next/link";

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#14304f] bg-[#030c18]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-13 flex items-center justify-between" style={{ height: "52px" }}>
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="AInvestor home"
        >
          {/* Chart icon */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-[#00c896] group-hover:text-[#00e0aa] transition-colors">
            <polyline points="2,16 7,9 12,13 17,5 20,8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <line x1="2" y1="19" x2="20" y2="19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
          </svg>
          <span className="font-display text-lg font-700 tracking-tight text-slate-100 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.01em" }}>
            <span className="text-[#00c896]">AI</span>NVESTOR
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="live-dot size-1.5 rounded-full bg-[#00c896]" />
            <span className="text-xs font-mono text-[#00c896] tracking-widest uppercase">Live</span>
          </div>
          <div className="h-4 w-px bg-[#14304f]" />
          <span className="rounded border border-[#14304f] bg-[#071525] px-2.5 py-1 text-xs font-mono text-[#5d8aaa] tracking-wide">
            GPT-4o mini
          </span>
        </div>
      </div>
    </nav>
  );
}
