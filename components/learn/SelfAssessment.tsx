"use client";

import { useEffect, useMemo, useState } from "react";

interface SelfAssessmentProps {
  items: string[];
  lessonKey?: string;
}

function loadCheckedState(key: string, count: number): boolean[] {
  try {
    const stored = localStorage.getItem(`self-assessment:${key}`);
    if (!stored) return new Array(count).fill(false);
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length === count) return parsed;
    return new Array(count).fill(false);
  } catch {
    return new Array(count).fill(false);
  }
}

function saveCheckedState(key: string, state: boolean[]) {
  try {
    localStorage.setItem(`self-assessment:${key}`, JSON.stringify(state));
  } catch {
    // QuotaExceededError
  }
}

export function SelfAssessment({ items, lessonKey }: SelfAssessmentProps) {
  const [mounted, setMounted] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );

  const storageKey = useMemo(() => {
    if (lessonKey) return lessonKey;
    if (typeof window !== "undefined") {
      return window.location.pathname
        .replace(/^\/learn\//, "")
        .replace(/\/$/, "");
    }
    return "unknown";
  }, [lessonKey]);

  useEffect(() => {
    setChecked(loadCheckedState(storageKey, items.length));
    setMounted(true);
  }, [storageKey, items.length]);

  function toggle(index: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      saveCheckedState(storageKey, next);
      return next;
    });
  }

  const checkedCount = checked.filter(Boolean).length;

  return (
    <div className="my-8 rounded-lg border border-border bg-surface-raised p-6">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Self-Assessment
        </h3>
        {mounted && (
          <span className="text-xs text-text-muted">
            {checkedCount} of {items.length} confident
          </span>
        )}
      </div>
      <p className="mb-4 text-sm text-text-secondary">
        Check off each item as you feel confident about it.
      </p>

      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <button
              onClick={() => toggle(i)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                mounted && checked[i]
                  ? "border-electric-500 bg-electric-500 text-white"
                  : "border-text-muted hover:border-electric-500"
              }`}
              aria-label={`${checked[i] ? "Uncheck" : "Check"}: ${item}`}
            >
              {mounted && checked[i] && (
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <span
              className={`text-sm leading-relaxed ${
                mounted && checked[i]
                  ? "text-text-muted line-through"
                  : "text-text-secondary"
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
