"use client";

import { type ReactNode } from "react";

interface DetailsProps {
  title: string;
  children: ReactNode;
}

export function Details({ title, children }: DetailsProps) {
  return (
    <details className="group my-6 card-v2">
      <summary className="flex cursor-pointer items-center gap-2 px-5 py-3 text-sm font-semibold text-text-primary select-none">
        <svg
          className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {title}
      </summary>
      <div className="details-content">
        <div className="border-t border-border px-5 py-4 text-text-secondary leading-7 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </details>
  );
}
