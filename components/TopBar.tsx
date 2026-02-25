import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-text-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-electric-500">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span>The Intent Workshop</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/learn" className="text-text-secondary hover:text-text-primary transition-colors">
              Learn
            </Link>
            <Link href="/reference" className="text-text-secondary hover:text-text-primary transition-colors">
              Reference
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
