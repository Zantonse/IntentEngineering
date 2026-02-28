"use client";

import { useState } from "react";

interface KnowledgeCheckProps {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export function KnowledgeCheck({
  question,
  options,
  correct,
  explanation,
}: KnowledgeCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === correct;

  return (
    <div className="my-8 rounded-lg border border-border bg-surface-raised p-6">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Knowledge Check
      </div>
      <p className="mb-4 text-text-primary font-medium">{question}</p>

      <div className="space-y-2">
        {options.map((option, i) => {
          let optionStyle =
            "border-border hover:border-electric-500/50 hover:bg-surface-overlay cursor-pointer";

          if (answered) {
            if (i === correct) {
              optionStyle = "border-mod-building bg-mod-building/5";
            } else if (i === selected) {
              optionStyle = "border-mod-practice bg-mod-practice/5";
            } else {
              optionStyle = "border-border opacity-50";
            }
          }

          return (
            <button
              key={i}
              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${optionStyle}`}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                  answered && i === correct
                    ? "border-mod-building bg-mod-building text-white"
                    : answered && i === selected
                      ? "border-mod-practice bg-mod-practice text-white"
                      : "border-text-muted"
                }`}
              >
                {answered && i === correct
                  ? "✓"
                  : answered && i === selected
                    ? "✗"
                    : String.fromCharCode(65 + i)}
              </span>
              <span
                className={
                  answered && i !== correct && i !== selected
                    ? "text-text-muted"
                    : "text-text-secondary"
                }
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm leading-relaxed ${
            isCorrect
              ? "bg-mod-building/5 border border-mod-building/20 text-text-secondary"
              : "bg-mod-practice/5 border border-mod-practice/20 text-text-secondary"
          }`}
        >
          <span className="font-semibold text-text-primary">
            {isCorrect ? "Correct!" : "Not quite."}
          </span>{" "}
          {explanation}
        </div>
      )}
    </div>
  );
}
