"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/mdx";

interface TableOfContentsProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="mb-8 rounded-lg border border-border bg-surface-raised px-5 py-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
        On this page
      </h2>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block text-sm py-0.5 transition-colors ${
                heading.level === 3 ? "pl-4" : ""
              } ${
                activeId === heading.id
                  ? "text-electric-500 font-medium"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
