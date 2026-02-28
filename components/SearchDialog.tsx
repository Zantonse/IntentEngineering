"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse, { type FuseResult } from "fuse.js";

interface SearchEntry {
  title: string;
  description: string;
  module: string;
  moduleTitle: string;
  slug: string;
  href: string;
  body: string;
  headings: string[];
}

const MODULE_COLORS: Record<string, string> = {
  foundations: "bg-electric-500",
  "building-skills": "bg-mod-building",
  orchestration: "bg-amber-500",
  "intent-engineering": "bg-mod-intent",
  "building-your-agent": "bg-mod-practice",
  reference: "bg-slate-400",
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FuseResult<SearchEntry>[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fuse, setFuse] = useState<Fuse<SearchEntry> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load search index on first open
  useEffect(() => {
    if (!open || fuse) return;

    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: SearchEntry[]) => {
        setFuse(
          new Fuse(data, {
            keys: [
              { name: "title", weight: 3 },
              { name: "headings", weight: 2 },
              { name: "description", weight: 1.5 },
              { name: "body", weight: 1 },
            ],
            includeMatches: true,
            threshold: 0.3,
            minMatchCharLength: 2,
          })
        );
      })
      .catch(() => {
        // Search index not available
      });
  }, [open, fuse]);

  // Cmd+K to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Search on query change
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    setResults(fuse.search(query, { limit: 8 }));
    setSelectedIndex(0);
  }, [query, fuse]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex].item.href);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <svg
            className="h-5 w-5 shrink-0 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search lessons, concepts, terms..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="hidden sm:inline-block rounded border border-border px-1.5 py-0.5 text-xs text-text-muted">
            esc
          </kbd>
        </div>

        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((result, i) => (
              <li key={result.item.href}>
                <button
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    i === selectedIndex
                      ? "bg-surface-overlay"
                      : "hover:bg-surface-raised"
                  }`}
                  onClick={() => navigate(result.item.href)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      MODULE_COLORS[result.item.module] || "bg-slate-400"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-text-primary">
                      {result.item.title}
                    </div>
                    <div className="text-xs text-text-muted">
                      {result.item.moduleTitle}
                    </div>
                    {result.item.description && (
                      <div className="mt-0.5 truncate text-xs text-text-secondary">
                        {result.item.description}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim() && results.length === 0 && fuse && (
          <div className="px-4 py-8 text-center text-sm text-text-muted">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}

        {query.trim() && !fuse && (
          <div className="px-4 py-8 text-center text-sm text-text-muted">
            Loading search index...
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchButton() {
  return (
    <button
      onClick={() =>
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true })
        )
      }
      className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted hover:text-text-primary hover:border-text-muted transition-colors"
      aria-label="Search"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden sm:inline-block rounded border border-border px-1 py-0.5 text-xs">
        ⌘K
      </kbd>
    </button>
  );
}
