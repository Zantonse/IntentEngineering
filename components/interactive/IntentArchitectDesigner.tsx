"use client";

import { useState, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Priority = "NON-NEGOTIABLE" | "HIGH" | "MEDIUM" | "LOW";
type EvalType = "Automated" | "Human Review" | "Hybrid";

interface Constraint {
  id: string;
  text: string;
  priority: Priority;
}

interface MemoryStrategy {
  claudeMd: boolean;
  autoMemory: boolean;
  scratchpad: boolean;
  compaction: boolean;
  notes: string;
}

interface Skill {
  id: string;
  name: string;
  role: string;
}

interface EvalCriterion {
  id: string;
  criterion: string;
  type: EvalType;
}

interface ArchitectureState {
  goal: string;
  constraints: Constraint[];
  memory: MemoryStrategy;
  skills: Skill[];
  evaluation: EvalCriterion[];
}

type LayerKey = "goal" | "constraints" | "memory" | "skills" | "evaluation";

// ─── Presets ─────────────────────────────────────────────────────────────────

const SE_DISCOVERY_PRESET: ArchitectureState = {
  goal: "Prepare comprehensive, tailored discovery questions for technical buyer meetings that uncover genuine pain points and map to product capabilities",
  constraints: [
    {
      id: "c1",
      text: "Questions must be specific to prospect's industry and tech stack",
      priority: "NON-NEGOTIABLE",
    },
    {
      id: "c2",
      text: "Cover all four categories: current state, requirements, decision criteria, competitive landscape",
      priority: "HIGH",
    },
    {
      id: "c3",
      text: "Limit to 15-20 questions per session",
      priority: "MEDIUM",
    },
    {
      id: "c4",
      text: "Include follow-up probes for each primary question",
      priority: "LOW",
    },
  ],
  memory: {
    claudeMd: true,
    autoMemory: true,
    scratchpad: false,
    compaction: false,
    notes: "",
  },
  skills: [
    {
      id: "s1",
      name: "discovery-questions",
      role: "Generate targeted questions based on prospect context",
    },
    {
      id: "s2",
      name: "industry-research",
      role: "Pull industry-specific pain points and terminology",
    },
    {
      id: "s3",
      name: "call-prep-formatter",
      role: "Format output as structured call prep document",
    },
  ],
  evaluation: [
    {
      id: "e1",
      criterion: "Questions cover all four required categories",
      type: "Automated",
    },
    {
      id: "e2",
      criterion: "Questions reference prospect-specific context (not generic)",
      type: "Human Review",
    },
    {
      id: "e3",
      criterion: "Output follows call prep template format",
      type: "Automated",
    },
  ],
};

const RFP_RESPONSE_PRESET: ArchitectureState = {
  goal: "Generate accurate, compliant RFP responses that map product capabilities to stated requirements and highlight competitive differentiators",
  constraints: [
    {
      id: "c1",
      text: "Every requirement must have a response — no gaps",
      priority: "NON-NEGOTIABLE",
    },
    {
      id: "c2",
      text: "Responses must accurately reflect current product capabilities",
      priority: "NON-NEGOTIABLE",
    },
    {
      id: "c3",
      text: "Flag requirements that need SME review",
      priority: "HIGH",
    },
    {
      id: "c4",
      text: "Match the RFP's formatting and numbering conventions",
      priority: "MEDIUM",
    },
  ],
  memory: {
    claudeMd: true,
    autoMemory: false,
    scratchpad: true,
    compaction: true,
    notes: "Track requirement-to-capability mappings across sections",
  },
  skills: [
    {
      id: "s1",
      name: "rfp-parser",
      role: "Extract structured requirements from RFP document",
    },
    {
      id: "s2",
      name: "capability-matcher",
      role: "Map requirements to product features and identify gaps",
    },
    {
      id: "s3",
      name: "response-drafter",
      role: "Generate compliant responses per requirement",
    },
    {
      id: "s4",
      name: "response-reviewer",
      role: "Check consistency, accuracy, and completeness",
    },
  ],
  evaluation: [
    {
      id: "e1",
      criterion: "100% of requirements have responses",
      type: "Automated",
    },
    {
      id: "e2",
      criterion: "No capability claims contradict product documentation",
      type: "Hybrid",
    },
    {
      id: "e3",
      criterion: "SME-flagged items reviewed by subject matter expert",
      type: "Human Review",
    },
    {
      id: "e4",
      criterion: "Response follows RFP formatting conventions",
      type: "Automated",
    },
  ],
};

const EMPTY_STATE: ArchitectureState = {
  goal: "",
  constraints: [],
  memory: {
    claudeMd: false,
    autoMemory: false,
    scratchpad: false,
    compaction: false,
    notes: "",
  },
  skills: [],
  evaluation: [],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return crypto.randomUUID();
}

function priorityColor(priority: Priority): string {
  switch (priority) {
    case "NON-NEGOTIABLE":
      return "text-red-500";
    case "HIGH":
      return "text-amber-500";
    case "MEDIUM":
      return "text-electric-500";
    case "LOW":
      return "text-text-muted";
  }
}

function priorityBadgeClass(priority: Priority): string {
  switch (priority) {
    case "NON-NEGOTIABLE":
      return "bg-red-500/10 text-red-500 border-red-500/30";
    case "HIGH":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    case "MEDIUM":
      return "bg-electric-500/10 text-electric-500 border-electric-500/30";
    case "LOW":
      return "bg-surface-overlay text-text-muted border-border";
  }
}

function evalTypeBadgeClass(type: EvalType): string {
  switch (type) {
    case "Automated":
      return "bg-mod-intent/10 text-mod-intent border-mod-intent/30";
    case "Human Review":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    case "Hybrid":
      return "bg-surface-overlay text-text-secondary border-border";
  }
}

// ─── Layer section header ─────────────────────────────────────────────────────

interface LayerHeaderProps {
  icon: string;
  label: string;
  sublabel: string;
  expanded: boolean;
  onToggle: () => void;
}

function LayerHeader({ icon, label, sublabel, expanded, onToggle }: LayerHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-mod-intent/5 transition-colors text-left"
    >
      <span className="text-base leading-none">{icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-text-primary">{label}</span>
        {!expanded && (
          <span className="ml-2 text-xs text-text-muted">{sublabel}</span>
        )}
      </div>
      <svg
        className={`w-4 h-4 text-text-muted transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function IntentArchitectDesigner() {
  const [arch, setArch] = useState<ArchitectureState>(SE_DISCOVERY_PRESET);
  const [activePreset, setActivePreset] = useState<"se-discovery" | "rfp-response" | null>(
    "se-discovery"
  );
  const [expanded, setExpanded] = useState<Record<LayerKey, boolean>>({
    goal: true,
    constraints: false,
    memory: false,
    skills: false,
    evaluation: false,
  });
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // ── Preset loaders ──

  function loadPreset(preset: "se-discovery" | "rfp-response") {
    setArch(preset === "se-discovery" ? SE_DISCOVERY_PRESET : RFP_RESPONSE_PRESET);
    setActivePreset(preset);
    setExpanded({ goal: true, constraints: false, memory: false, skills: false, evaluation: false });
  }

  function clearAll() {
    setArch(EMPTY_STATE);
    setActivePreset(null);
    setExpanded({ goal: true, constraints: false, memory: false, skills: false, evaluation: false });
  }

  function toggleLayer(key: LayerKey) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // ── Goal ──

  function setGoal(value: string) {
    setArch((prev) => ({ ...prev, goal: value }));
    setActivePreset(null);
  }

  // ── Constraints ──

  function addConstraint() {
    const newConstraint: Constraint = {
      id: uid(),
      text: "",
      priority: "MEDIUM",
    };
    setArch((prev) => ({ ...prev, constraints: [...prev.constraints, newConstraint] }));
    setActivePreset(null);
  }

  function updateConstraint(id: string, field: "text" | "priority", value: string) {
    setArch((prev) => ({
      ...prev,
      constraints: prev.constraints.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
    setActivePreset(null);
  }

  function deleteConstraint(id: string) {
    setArch((prev) => ({
      ...prev,
      constraints: prev.constraints.filter((c) => c.id !== id),
    }));
    setActivePreset(null);
  }

  // ── Memory ──

  function toggleMemoryFlag(flag: keyof Omit<MemoryStrategy, "notes">) {
    setArch((prev) => ({
      ...prev,
      memory: { ...prev.memory, [flag]: !prev.memory[flag] },
    }));
    setActivePreset(null);
  }

  function setMemoryNotes(value: string) {
    setArch((prev) => ({ ...prev, memory: { ...prev.memory, notes: value } }));
    setActivePreset(null);
  }

  // ── Skills ──

  function addSkill() {
    const newSkill: Skill = { id: uid(), name: "", role: "" };
    setArch((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
    setActivePreset(null);
  }

  function updateSkill(id: string, field: "name" | "role", value: string) {
    setArch((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
    setActivePreset(null);
  }

  function deleteSkill(id: string) {
    setArch((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
    setActivePreset(null);
  }

  // ── Evaluation ──

  function addCriterion() {
    const newCriterion: EvalCriterion = { id: uid(), criterion: "", type: "Automated" };
    setArch((prev) => ({ ...prev, evaluation: [...prev.evaluation, newCriterion] }));
    setActivePreset(null);
  }

  function updateCriterion(id: string, field: "criterion" | "type", value: string) {
    setArch((prev) => ({
      ...prev,
      evaluation: prev.evaluation.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));
    setActivePreset(null);
  }

  function deleteCriterion(id: string) {
    setArch((prev) => ({
      ...prev,
      evaluation: prev.evaluation.filter((e) => e.id !== id),
    }));
    setActivePreset(null);
  }

  // ── YAML summary ──

  const yamlSummary = useMemo(() => {
    const indent = (str: string, n: number) =>
      str
        .split("\n")
        .map((line) => " ".repeat(n) + line)
        .join("\n");

    const constraintLines = arch.constraints
      .map(
        (c) =>
          `  - text: "${c.text}"\n    priority: ${c.priority}`
      )
      .join("\n");

    const memoryFlags = [
      arch.memory.claudeMd ? "  claude_md: true" : "  claude_md: false",
      arch.memory.autoMemory ? "  auto_memory: true" : "  auto_memory: false",
      arch.memory.scratchpad ? "  scratchpad: true" : "  scratchpad: false",
      arch.memory.compaction ? "  compaction: true" : "  compaction: false",
    ].join("\n");

    const memoryNotes = arch.memory.notes
      ? `\n  notes: "${arch.memory.notes}"`
      : "";

    const skillLines = arch.skills
      .map((s) => `  - name: ${s.name || '""'}\n    role: "${s.role}"`)
      .join("\n");

    const evalLines = arch.evaluation
      .map((e) => `  - criterion: "${e.criterion}"\n    type: ${e.type}`)
      .join("\n");

    return [
      `goal: >`,
      `  ${arch.goal || "(not set)"}`,
      ``,
      `constraints:`,
      constraintLines || "  []",
      ``,
      `memory:`,
      memoryFlags + memoryNotes,
      ``,
      `skills:`,
      skillLines || "  []",
      ``,
      `evaluation:`,
      evalLines || "  []",
    ].join("\n");
  }, [arch]);

  function handleCopy() {
    navigator.clipboard.writeText(yamlSummary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Sublabel helpers for collapsed state ──

  const constraintSublabel = useMemo(() => {
    const count = arch.constraints.length;
    if (count === 0) return "none";
    const nonNeg = arch.constraints.filter((c) => c.priority === "NON-NEGOTIABLE").length;
    return nonNeg > 0 ? `${count} total, ${nonNeg} non-negotiable` : `${count} defined`;
  }, [arch.constraints]);

  const memorySublabel = useMemo(() => {
    const active = [
      arch.memory.claudeMd && "CLAUDE.md",
      arch.memory.autoMemory && "auto-memory",
      arch.memory.scratchpad && "scratchpad",
      arch.memory.compaction && "compaction",
    ].filter(Boolean);
    return active.length > 0 ? active.join(", ") : "none selected";
  }, [arch.memory]);

  const skillsSublabel = useMemo(() => {
    const count = arch.skills.length;
    return count === 0 ? "none" : `${count} skill${count !== 1 ? "s" : ""}`;
  }, [arch.skills]);

  const evalSublabel = useMemo(() => {
    const count = arch.evaluation.length;
    return count === 0 ? "none" : `${count} criterion${count !== 1 ? "a" : ""}`;
  }, [arch.evaluation]);

  // ── Render ──

  return (
    <div className="my-8 card-gradient-border overflow-hidden">
      {/* Mac chrome header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-surface-raised border-b border-border">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-3 font-mono text-xs text-text-muted">
          intent-system/architecture.yaml
        </span>
      </div>

      {/* Preset buttons row */}
      <div className="flex items-center gap-2 px-4 py-3 bg-surface-raised border-b border-border flex-wrap">
        <button
          onClick={() => loadPreset("se-discovery")}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            activePreset === "se-discovery"
              ? "bg-mod-intent/20 text-mod-intent border-mod-intent"
              : "bg-surface-overlay text-text-secondary border-border hover:border-mod-intent/50 hover:text-mod-intent"
          }`}
        >
          SE Discovery System
        </button>
        <button
          onClick={() => loadPreset("rfp-response")}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            activePreset === "rfp-response"
              ? "bg-mod-intent/20 text-mod-intent border-mod-intent"
              : "bg-surface-overlay text-text-secondary border-border hover:border-mod-intent/50 hover:text-mod-intent"
          }`}
        >
          RFP Response System
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-1 text-xs rounded-full border bg-surface-overlay text-text-secondary border-border hover:border-mod-intent/50 hover:text-mod-intent transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Accordion layers */}
      <div className="bg-surface-raised divide-y divide-border">

        {/* ── Layer 1: Goal ── */}
        <div>
          <div className="border-l-4 border-mod-intent">
            <LayerHeader
              icon="🎯"
              label="Goal"
              sublabel={arch.goal ? arch.goal.slice(0, 60) + (arch.goal.length > 60 ? "…" : "") : "not set"}
              expanded={expanded.goal}
              onToggle={() => toggleLayer("goal")}
            />
          </div>
          {expanded.goal && (
            <div className="border-l-4 border-mod-intent px-5 pb-5 pt-1">
              <p className="text-xs text-text-muted mb-2">
                What must be accomplished? Be specific and measurable.
              </p>
              <textarea
                rows={4}
                value={arch.goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Describe the primary goal of this intent system..."
                className="w-full bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-mod-intent resize-none"
              />
            </div>
          )}
        </div>

        {/* ── Layer 2: Constraints ── */}
        <div>
          <div className="border-l-4 border-red-500">
            <LayerHeader
              icon="🛡️"
              label="Constraints"
              sublabel={constraintSublabel}
              expanded={expanded.constraints}
              onToggle={() => toggleLayer("constraints")}
            />
          </div>
          {expanded.constraints && (
            <div className="border-l-4 border-red-500 px-5 pb-5 pt-1">
              <p className="text-xs text-text-muted mb-3">
                Rules the system must never violate. Assign priority to each.
              </p>
              <div className="space-y-2">
                {arch.constraints.length === 0 && (
                  <p className="text-sm text-text-muted py-2">No constraints defined.</p>
                )}
                {arch.constraints.map((constraint) => (
                  <div key={constraint.id} className="flex items-start gap-2">
                    <input
                      type="text"
                      value={constraint.text}
                      onChange={(e) => updateConstraint(constraint.id, "text", e.target.value)}
                      placeholder="Describe the constraint..."
                      className="flex-1 bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-mod-intent"
                    />
                    <select
                      value={constraint.priority}
                      onChange={(e) =>
                        updateConstraint(constraint.id, "priority", e.target.value)
                      }
                      className={`shrink-0 bg-surface-overlay border rounded-md px-2 py-2 text-xs font-semibold focus:outline-none focus:border-mod-intent cursor-pointer transition-colors ${priorityBadgeClass(constraint.priority)} border`}
                    >
                      <option value="NON-NEGOTIABLE">NON-NEGOTIABLE</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                    <button
                      onClick={() => deleteConstraint(constraint.id)}
                      className="shrink-0 mt-0.5 p-2 text-text-muted hover:text-red-500 transition-colors rounded-md hover:bg-red-500/10"
                      aria-label="Delete constraint"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addConstraint}
                className="mt-3 flex items-center gap-1.5 text-xs text-mod-intent hover:text-mod-intent/80 border border-dashed border-mod-intent/40 rounded-md px-3 py-1.5 hover:bg-mod-intent/10 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Constraint
              </button>
            </div>
          )}
        </div>

        {/* ── Layer 3: Memory Strategy ── */}
        <div>
          <div className="border-l-4 border-amber-500">
            <LayerHeader
              icon="🧠"
              label="Memory Strategy"
              sublabel={memorySublabel}
              expanded={expanded.memory}
              onToggle={() => toggleLayer("memory")}
            />
          </div>
          {expanded.memory && (
            <div className="border-l-4 border-amber-500 px-5 pb-5 pt-1">
              <p className="text-xs text-text-muted mb-3">
                Select which memory mechanisms this system uses.
              </p>
              <div className="space-y-2 mb-4">
                {(
                  [
                    {
                      flag: "claudeMd" as const,
                      label: "CLAUDE.md",
                      desc: "Project-level persistent instructions",
                    },
                    {
                      flag: "autoMemory" as const,
                      label: "Auto memory",
                      desc: "Claude's automatic notes and learnings",
                    },
                    {
                      flag: "scratchpad" as const,
                      label: "Session scratchpad",
                      desc: "Structured notes within context",
                    },
                    {
                      flag: "compaction" as const,
                      label: "Compaction strategy",
                      desc: "Summarize at context limits",
                    },
                  ] as const
                ).map(({ flag, label, desc }) => (
                  <label
                    key={flag}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <span
                      className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                        arch.memory[flag]
                          ? "bg-mod-intent border-mod-intent"
                          : "bg-surface-overlay border-border group-hover:border-mod-intent/60"
                      }`}
                      onClick={() => toggleMemoryFlag(flag)}
                    >
                      {arch.memory[flag] && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="flex flex-col" onClick={() => toggleMemoryFlag(flag)}>
                      <span className="text-sm font-semibold text-text-primary font-mono">
                        {label}
                      </span>
                      <span className="text-xs text-text-muted">{desc}</span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Memory notes <span className="font-normal normal-case text-text-muted">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={arch.memory.notes}
                  onChange={(e) => setMemoryNotes(e.target.value)}
                  placeholder="Any additional context about how memory is used..."
                  className="w-full bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-mod-intent resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Layer 4: Skills & Tools ── */}
        <div>
          <div className="border-l-4 border-green-500">
            <LayerHeader
              icon="🔧"
              label="Skills & Tools"
              sublabel={skillsSublabel}
              expanded={expanded.skills}
              onToggle={() => toggleLayer("skills")}
            />
          </div>
          {expanded.skills && (
            <div className="border-l-4 border-green-500 px-5 pb-5 pt-1">
              <p className="text-xs text-text-muted mb-3">
                Define the skills and sub-agents this system delegates to.
              </p>
              <div className="space-y-2">
                {arch.skills.length === 0 && (
                  <p className="text-sm text-text-muted py-2">No skills defined.</p>
                )}
                {arch.skills.map((skill) => (
                  <div key={skill.id} className="flex items-start gap-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                      placeholder="skill-name"
                      className="w-40 shrink-0 font-mono bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-mod-intent"
                    />
                    <input
                      type="text"
                      value={skill.role}
                      onChange={(e) => updateSkill(skill.id, "role", e.target.value)}
                      placeholder="What this skill does in the system..."
                      className="flex-1 bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-mod-intent"
                    />
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="shrink-0 mt-0.5 p-2 text-text-muted hover:text-red-500 transition-colors rounded-md hover:bg-red-500/10"
                      aria-label="Delete skill"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addSkill}
                className="mt-3 flex items-center gap-1.5 text-xs text-mod-intent hover:text-mod-intent/80 border border-dashed border-mod-intent/40 rounded-md px-3 py-1.5 hover:bg-mod-intent/10 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Skill
              </button>
            </div>
          )}
        </div>

        {/* ── Layer 5: Evaluation Criteria ── */}
        <div>
          <div className="border-l-4 border-mod-intent">
            <LayerHeader
              icon="📊"
              label="Evaluation Criteria"
              sublabel={evalSublabel}
              expanded={expanded.evaluation}
              onToggle={() => toggleLayer("evaluation")}
            />
          </div>
          {expanded.evaluation && (
            <div className="border-l-4 border-mod-intent px-5 pb-5 pt-1">
              <p className="text-xs text-text-muted mb-3">
                How will you know the system is working? Define measurable criteria and how each will be evaluated.
              </p>
              <div className="space-y-2">
                {arch.evaluation.length === 0 && (
                  <p className="text-sm text-text-muted py-2">No criteria defined.</p>
                )}
                {arch.evaluation.map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <input
                      type="text"
                      value={item.criterion}
                      onChange={(e) => updateCriterion(item.id, "criterion", e.target.value)}
                      placeholder="Describe the success criterion..."
                      className="flex-1 bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-mod-intent"
                    />
                    <select
                      value={item.type}
                      onChange={(e) => updateCriterion(item.id, "type", e.target.value)}
                      className={`shrink-0 bg-surface-overlay border rounded-md px-2 py-2 text-xs font-semibold focus:outline-none focus:border-mod-intent cursor-pointer transition-colors ${evalTypeBadgeClass(item.type)}`}
                    >
                      <option value="Automated">Automated</option>
                      <option value="Human Review">Human Review</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    <button
                      onClick={() => deleteCriterion(item.id)}
                      className="shrink-0 mt-0.5 p-2 text-text-muted hover:text-red-500 transition-colors rounded-md hover:bg-red-500/10"
                      aria-label="Delete criterion"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addCriterion}
                className="mt-3 flex items-center gap-1.5 text-xs text-mod-intent hover:text-mod-intent/80 border border-dashed border-mod-intent/40 rounded-md px-3 py-1.5 hover:bg-mod-intent/10 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Criterion
              </button>
            </div>
          )}
        </div>
      </div>

      {/* System Summary */}
      <div className="border-t border-border bg-surface-raised">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              System Summary
            </span>
            <span className="text-xs text-text-muted font-mono">
              architecture.yaml preview
            </span>
          </div>
          <button
            onClick={() => setShowSummary((v) => !v)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
              showSummary
                ? "bg-mod-intent/10 border-mod-intent text-mod-intent"
                : "bg-surface-overlay border-border text-text-secondary hover:border-mod-intent hover:text-mod-intent"
            }`}
          >
            {showSummary ? "Hide Summary" : "Show Summary"}
          </button>
        </div>

        {showSummary && (
          <div className="mx-5 mb-5 rounded-md border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-surface-overlay border-b border-border">
              <span className="text-xs font-mono text-text-muted">architecture.yaml</span>
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded text-xs font-semibold border border-border bg-surface-raised text-text-secondary hover:border-mod-intent hover:text-mod-intent transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-text-primary bg-surface-overlay overflow-x-auto whitespace-pre-wrap break-words">
              {yamlSummary}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
