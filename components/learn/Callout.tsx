"use client";

import { type ReactNode } from "react";

const CALLOUT_CONFIG = {
  key: {
    borderColor: "border-l-electric-500",
    bgColor: "bg-electric-500/3",
    label: "Key Concept",
  },
  tip: {
    borderColor: "border-l-mod-building",
    bgColor: "bg-mod-building/3",
    label: "Tip",
  },
  warning: {
    borderColor: "border-l-amber-500",
    bgColor: "bg-amber-500/3",
    label: "Warning",
  },
  example: {
    borderColor: "border-l-mod-intent",
    bgColor: "bg-mod-intent/3",
    label: "Example",
  },
} as const;

const ICONS = {
  key: (
    <svg
      className="h-4 w-4 text-electric-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  tip: (
    <svg
      className="h-4 w-4 text-mod-building"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      className="h-4 w-4 text-amber-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  example: (
    <svg
      className="h-4 w-4 text-mod-intent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
} as const;

type CalloutType = keyof typeof CALLOUT_CONFIG;

interface CalloutProps {
  type: CalloutType;
  children: ReactNode;
}

export function Callout({ type, children }: CalloutProps) {
  const config = CALLOUT_CONFIG[type];

  return (
    <div
      className={`my-6 rounded-r-lg border-l-2 ${config.borderColor} ${config.bgColor} px-5 py-4`}
    >
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-text-primary">
        {ICONS[type]}
        <span>{config.label}</span>
      </div>
      <div className="text-text-secondary leading-7 [&>p]:mb-0">{children}</div>
    </div>
  );
}
