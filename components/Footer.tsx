import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy-950 dark:bg-[#080a14] text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-electric-500">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span>The Intent Workshop</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/learn" className="hover:text-slate-200 transition-colors">
              Learn
            </Link>
            <Link href="/reference" className="hover:text-slate-200 transition-colors">
              Reference
            </Link>
            <a
              href="https://www.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors"
            >
              Built with Claude Code
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
