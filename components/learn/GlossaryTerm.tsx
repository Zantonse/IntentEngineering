"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

interface GlossaryTermProps {
  term: string;
  definition: string;
  slug: string;
  children: ReactNode;
}

export function GlossaryTerm({
  term,
  definition,
  slug,
  children,
}: GlossaryTermProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(true);
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setShowTooltip(false), 200);
  }

  return (
    <span
      className="relative inline"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span
        className="border-b border-dotted border-electric-500/50 cursor-help"
        tabIndex={0}
        onFocus={handleEnter}
        onBlur={handleLeave}
        aria-describedby={`glossary-${slug}`}
      >
        {children}
      </span>
      {showTooltip && (
        <div
          id={`glossary-${slug}`}
          role="tooltip"
          className="absolute bottom-full left-0 z-30 mb-2 w-72 rounded-lg border border-border bg-surface p-3 shadow-lg"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <div className="mb-1 text-xs font-semibold text-text-primary">
            {term}
          </div>
          <p className="text-xs leading-relaxed text-text-secondary">
            {definition}
          </p>
          <a
            href={`/reference/glossary#${slug}`}
            className="mt-2 inline-block text-xs text-electric-500 hover:underline"
          >
            View in glossary →
          </a>
        </div>
      )}
    </span>
  );
}
