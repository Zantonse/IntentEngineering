"use client";

import { useState } from "react";

interface AnnotatedSection {
  id: string;
  label: string;
  lines: string;
  explanation: string;
  highlight: string;
}

const SKILL_EXAMPLE = `---
name: discovery-questions
description: This skill should be used when the user
  asks to "prepare discovery questions", "plan a
  technical discovery call", "generate questions for
  a prospect meeting", or mentions understanding
  customer requirements and technical needs.
version: 0.1.0
---

# Technical Discovery Questions

Generate targeted technical discovery questions
based on prospect context, industry, and the
product capabilities being evaluated.

## When This Skill Applies

This skill activates when preparing for:
- Initial discovery calls with technical buyers
- Deep-dive sessions on specific use cases
- Technical validation meetings

## Process

1. Gather prospect context (industry, size, stack)
2. Identify the product capabilities being evaluated
3. Generate questions organized by category:
   - Current state and pain points
   - Technical requirements and constraints
   - Decision criteria and timeline
   - Integration and security needs

## Additional Resources

### Reference Files
- **\`references/question-bank.md\`** — Full
  categorized question library
- **\`references/industries.md\`** — Industry-
  specific question templates

### Scripts
- **\`scripts/format-questions.sh\`** — Formats
  output as a structured call prep document`;

const ANNOTATIONS: AnnotatedSection[] = [
  {
    id: "frontmatter",
    label: "YAML Frontmatter",
    lines: "1-9",
    explanation:
      "The frontmatter is the most critical part of a skill. The 'name' identifies it, but the 'description' determines WHEN Claude loads the skill. It must use third-person ('This skill should be used when...') and include specific trigger phrases that match what users actually say. If the description doesn't match, the skill never fires — no matter how good the content is.",
    highlight: "border-electric-500",
  },
  {
    id: "title",
    label: "Skill Title & Purpose",
    lines: "11-14",
    explanation:
      "The opening section states what the skill does in plain language. This is Layer 2 content — it loads only when the skill triggers. Keep it concise: another Claude instance reading this should immediately understand the skill's purpose.",
    highlight: "border-mod-building",
  },
  {
    id: "when",
    label: "Activation Conditions",
    lines: "16-21",
    explanation:
      "Explicit activation conditions help Claude decide whether this skill is relevant to the current task. While the frontmatter description handles initial triggering, this section provides nuance about specific scenarios. This is different from the description — it's guidance for after the skill has loaded.",
    highlight: "border-amber-500",
  },
  {
    id: "process",
    label: "Core Process",
    lines: "23-33",
    explanation:
      "The procedural heart of the skill. Written in imperative form ('Gather...', 'Identify...', 'Generate...'), not second person ('You should...'). This is what makes skills powerful — they encode domain-specific workflows that an LLM wouldn't know on its own. Keep this in SKILL.md (Layer 2) since it's essential every time the skill loads.",
    highlight: "border-mod-intent",
  },
  {
    id: "resources",
    label: "Resource References",
    lines: "35-44",
    explanation:
      "References to Layer 3 content — files Claude loads only when needed. The question bank might be 5,000+ words, but it only enters the context window when Claude actually needs specific questions. This is progressive disclosure: SKILL.md stays lean (~1,500-2,000 words), with detailed content in references/, scripts/, and assets/.",
    highlight: "border-electric-400",
  },
];

export function SkillAnatomyExplorer() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const activeAnnotation = ANNOTATIONS.find((a) => a.id === activeSection);

  const lines = SKILL_EXAMPLE.split("\n");

  function getLineSection(lineIndex: number): string | null {
    for (const annotation of ANNOTATIONS) {
      const [start, end] = annotation.lines.split("-").map(Number);
      if (lineIndex + 1 >= start && lineIndex + 1 <= end) {
        return annotation.id;
      }
    }
    return null;
  }

  return (
    <div className="my-8 card-gradient-border overflow-hidden">
      <div className="bg-surface-overlay px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
        </div>
        <span className="text-xs font-mono text-text-muted ml-2">
          discovery-questions/SKILL.md
        </span>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Code panel */}
        <div className="flex-1 overflow-x-auto">
          <pre className="p-4 text-sm font-mono leading-relaxed">
            {lines.map((line, i) => {
              const section = getLineSection(i);
              const isActive = section === activeSection;
              const isInactive = activeSection !== null && section !== activeSection;

              return (
                <div
                  key={i}
                  className={`px-2 -mx-2 cursor-pointer transition-all duration-150 border-l-2 ${
                    isActive
                      ? `bg-electric-500/10 ${
                          activeAnnotation?.highlight ?? "border-electric-500"
                        }`
                      : isInactive
                        ? "border-transparent opacity-40"
                        : "border-transparent hover:bg-surface-overlay"
                  }`}
                  onClick={() =>
                    setActiveSection(section === activeSection ? null : section)
                  }
                >
                  <span className="text-text-muted select-none inline-block w-8 text-right mr-4">
                    {i + 1}
                  </span>
                  <span className="text-text-primary">{line || " "}</span>
                </div>
              );
            })}
          </pre>
        </div>

        {/* Annotation panel */}
        <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-border p-4">
          {activeAnnotation ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`h-2 w-2 rounded-full border-2 ${activeAnnotation.highlight}`}
                />
                <h3 className="font-semibold text-sm text-text-primary">
                  {activeAnnotation.label}
                </h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {activeAnnotation.explanation}
              </p>
              <p className="text-xs text-text-muted mt-3">
                Lines {activeAnnotation.lines}
              </p>
            </div>
          ) : (
            <div className="text-sm text-text-muted">
              <p className="font-medium text-text-secondary mb-2">
                Click any section to explore
              </p>
              <p>
                This is a real skill file for an SE &quot;Technical Discovery&quot;
                workflow. Click on different parts to learn what each section
                does and why it matters.
              </p>
              <div className="mt-4 space-y-2">
                {ANNOTATIONS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setActiveSection(a.id)}
                    className={`flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary transition-colors w-full text-left`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full border ${a.highlight}`}
                    />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
