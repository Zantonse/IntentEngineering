"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./SidebarNav";
import type { ModuleSlug } from "@/lib/constants";
import type { LessonMeta } from "@/lib/mdx";

interface MobileSidebarProps {
  modules: {
    slug: ModuleSlug;
    lessons: LessonMeta[];
  }[];
}

export function MobileSidebar({ modules }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Hamburger button - visible below lg */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-electric-500 text-white shadow-lg hover:bg-electric-400 transition-colors"
        aria-label="Open navigation"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] bg-surface border-r border-border-subtle p-6 overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="font-semibold text-text-primary text-sm">Navigation</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <SidebarNav modules={modules} />
      </div>
    </>
  );
}
