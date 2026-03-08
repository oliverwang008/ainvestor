import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#14304f] bg-[#071525] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-mono text-[#2d5070] tracking-wide">
            © 2026 OliTech&nbsp; |&nbsp; Your AI Investment Advisor&nbsp; |&nbsp; All Rights Reserved
          </p>
          <div className="flex items-center gap-5 text-xs text-[#2d5070]">
            <Link href="/methodology" className="hover:text-[#00c896] transition-colors tracking-wide">
              Data &amp; Methodology
            </Link>
            <span className="text-[#14304f]">|</span>
            <Link href="/privacy" className="hover:text-[#00c896] transition-colors tracking-wide">
              Privacy Policy
            </Link>
            <span className="text-[#14304f]">|</span>
            <span>Not financial advice.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
