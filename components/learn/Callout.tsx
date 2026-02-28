"use client";

import { type ReactNode } from "react";

const CALLOUT_CONFIG = {
  key: {
    borderColor: "border-l-electric-500",
    bgColor: "bg-electric-500/5",
    icon: "💡",
    label: "Key Concept",
  },
  tip: {
    borderColor: "border-l-mod-building",
    bgColor: "bg-mod-building/5",
    icon: "✅",
    label: "Tip",
  },
  warning: {
    borderColor: "border-l-amber-500",
    bgColor: "bg-amber-500/5",
    icon: "⚠️",
    label: "Warning",
  },
  example: {
    borderColor: "border-l-mod-intent",
    bgColor: "bg-mod-intent/5",
    icon: "📋",
    label: "Example",
  },
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
      className={`my-6 rounded-r-lg border-l-4 ${config.borderColor} ${config.bgColor} px-5 py-4`}
    >
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-text-primary">
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </div>
      <div className="text-text-secondary leading-7 [&>p]:mb-0">{children}</div>
    </div>
  );
}
