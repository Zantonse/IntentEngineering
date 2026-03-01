"use client";

import { useState } from "react";
import Link from "next/link";

const LAYERS = [
  {
    id: "prompts",
    label: "Prompt Engineering",
    description: "Crafting individual messages to get good outputs",
    color: "var(--color-slate-400)",
    href: "/learn/foundations",
    width: "40%",
  },
  {
    id: "skills",
    label: "Skill Engineering",
    description: "Your agent's domain expertise",
    color: "var(--color-mod-foundations)",
    href: "/learn/foundations",
    width: "55%",
  },
  {
    id: "orchestration",
    label: "Orchestration",
    description: "Your agent's autonomy and coordination",
    color: "var(--color-mod-orchestration)",
    href: "/learn/orchestration",
    width: "70%",
  },
  {
    id: "intent",
    label: "Intent Engineering",
    description: "Your deployed SE agent — accountable and production-ready",
    color: "var(--color-mod-intent)",
    href: "/learn/intent-engineering",
    width: "85%",
  },
];

export function LayerDiagram() {
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      {[...LAYERS].reverse().map((layer) => {
        const isHovered = hoveredLayer === layer.id;
        const isInactive = hoveredLayer !== null && hoveredLayer !== layer.id;

        return (
          <Link
            key={layer.id}
            href={layer.href}
            className={`relative rounded-lg border px-6 py-4 text-center transition-all duration-200 ${
              isHovered
                ? "scale-105 shadow-lg"
                : isInactive
                  ? "opacity-40"
                  : ""
            }`}
            style={{
              width: layer.width,
              borderColor: layer.color,
              backgroundColor: isHovered
                ? `color-mix(in srgb, ${layer.color} 10%, transparent)`
                : "var(--color-surface-raised)",
            }}
            onMouseEnter={() => setHoveredLayer(layer.id)}
            onMouseLeave={() => setHoveredLayer(null)}
          >
            <p className="font-semibold text-text-primary text-sm">
              {layer.label}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {layer.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
