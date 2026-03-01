"use client";

import { useState } from "react";

interface WorkflowStep {
  id: string;
  name: string;
  skill: string;
  description: string;
  input: string;
  output: string;
}

const POST_CALL_WORKFLOW: Omit<WorkflowStep, "id">[] = [
  {
    name: "Transcribe Meeting",
    skill: "meeting-transcriber",
    description:
      "Convert recorded meeting audio into structured text transcript with speaker labels",
    input: "Meeting recording",
    output: "Structured transcript",
  },
  {
    name: "Extract Action Items",
    skill: "action-item-extractor",
    description:
      "Parse transcript to identify commitments, deadlines, and assigned owners",
    input: "Structured transcript",
    output: "Action items list",
  },
  {
    name: "Draft Follow-Up",
    skill: "follow-up-composer",
    description:
      "Compose a professional follow-up email summarizing discussion and next steps",
    input: "Action items list",
    output: "Follow-up email draft",
  },
  {
    name: "Update CRM",
    skill: "crm-updater",
    description:
      "Log meeting notes, action items, and next steps in CRM opportunity record",
    input: "Follow-up email draft",
    output: "Updated CRM record",
  },
];

const RFP_PIPELINE: Omit<WorkflowStep, "id">[] = [
  {
    name: "Parse Requirements",
    skill: "rfp-parser",
    description:
      "Extract structured requirements, evaluation criteria, and deadlines from RFP document",
    input: "RFP document",
    output: "Parsed requirements",
  },
  {
    name: "Match Capabilities",
    skill: "capability-matcher",
    description:
      "Map each requirement to product capabilities and identify gaps",
    input: "Parsed requirements",
    output: "Capability matrix",
  },
  {
    name: "Draft Responses",
    skill: "response-drafter",
    description:
      "Generate detailed responses for each requirement based on capability matches",
    input: "Capability matrix",
    output: "Draft responses",
  },
  {
    name: "Review & Finalize",
    skill: "response-reviewer",
    description:
      "Review all responses for consistency, compliance, and completeness",
    input: "Draft responses",
    output: "Final RFP response",
  },
];

function makeSteps(defs: Omit<WorkflowStep, "id">[]): WorkflowStep[] {
  return defs.map((d) => ({ ...d, id: crypto.randomUUID() }));
}

interface InitialState {
  steps: WorkflowStep[];
  selectedStepId: string | null;
}

function buildInitialState(): InitialState {
  const steps = makeSteps(POST_CALL_WORKFLOW);
  return { steps, selectedStepId: steps[0]?.id ?? null };
}

export function OrchestrationFlowEditor() {
  const [{ steps, selectedStepId }, setEditorState] = useState<{
    steps: WorkflowStep[];
    selectedStepId: string | null;
  }>(buildInitialState);
  const [activePreset, setActivePreset] = useState<
    "post-call" | "rfp" | null
  >("post-call");

  const selectedStep = steps.find((s) => s.id === selectedStepId) ?? null;

  function loadPreset(preset: "post-call" | "rfp") {
    const defs = preset === "post-call" ? POST_CALL_WORKFLOW : RFP_PIPELINE;
    const newSteps = makeSteps(defs);
    setEditorState({ steps: newSteps, selectedStepId: newSteps[0]?.id ?? null });
    setActivePreset(preset);
  }

  function clearWorkflow() {
    setEditorState({ steps: [], selectedStepId: null });
    setActivePreset(null);
  }

  function selectStep(id: string) {
    setEditorState((prev) => ({ ...prev, selectedStepId: id }));
  }

  function addStep() {
    const newStep: WorkflowStep = {
      id: crypto.randomUUID(),
      name: "New Step",
      skill: "",
      description: "",
      input: "",
      output: "",
    };
    setEditorState((prev) => ({
      steps: [...prev.steps, newStep],
      selectedStepId: newStep.id,
    }));
    setActivePreset(null);
  }

  function deleteStep(id: string) {
    setEditorState((prev) => ({
      steps: prev.steps.filter((s) => s.id !== id),
      selectedStepId: prev.selectedStepId === id ? null : prev.selectedStepId,
    }));
    setActivePreset(null);
  }

  function updateStep(id: string, field: keyof WorkflowStep, value: string) {
    setEditorState((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
    setActivePreset(null);
  }

  return (
    <div className="my-8 card-gradient-border overflow-hidden">
      {/* Mac chrome header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-raised">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-2 font-mono text-xs text-text-muted">
          workflow-editor
        </span>
      </div>

      {/* Preset buttons row */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-raised">
        <button
          onClick={() => loadPreset("post-call")}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            activePreset === "post-call"
              ? "bg-amber-500/20 text-amber-500 border-amber-500"
              : "bg-surface-overlay text-text-secondary border-border hover:border-amber-500/50"
          }`}
        >
          Post-Call Workflow
        </button>
        <button
          onClick={() => loadPreset("rfp")}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            activePreset === "rfp"
              ? "bg-amber-500/20 text-amber-500 border-amber-500"
              : "bg-surface-overlay text-text-secondary border-border hover:border-amber-500/50"
          }`}
        >
          RFP Pipeline
        </button>
        <button
          onClick={clearWorkflow}
          className="px-3 py-1 text-xs rounded-full border bg-surface-overlay text-text-secondary border-border hover:border-amber-500/50 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row min-h-64">
        {/* Left panel — step list */}
        <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-surface-raised flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {steps.length === 0 && (
              <p className="text-sm text-text-muted text-center py-8">
                No steps yet. Load a preset or add a step.
              </p>
            )}
            {steps.map((step, index) => (
              <div key={step.id}>
                {/* Step card */}
                <button
                  onClick={() => selectStep(step.id)}
                  className={`w-full text-left rounded-md p-3 border-l-2 transition-colors ${
                    selectedStepId === step.id
                      ? "border-amber-500 bg-amber-500/5"
                      : "border-transparent hover:bg-surface-overlay"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {/* Number badge */}
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {step.name || "Untitled Step"}
                      </p>
                      {step.skill && (
                        <p className="font-mono text-xs text-amber-500 truncate mt-0.5">
                          {step.skill}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {step.input && (
                          <span className="text-xs bg-surface-overlay rounded px-1.5 py-0.5 text-text-muted">
                            {step.input}
                          </span>
                        )}
                        {step.input && step.output && (
                          <span className="text-xs text-text-muted">→</span>
                        )}
                        {step.output && (
                          <span className="text-xs bg-surface-overlay rounded px-1.5 py-0.5 text-text-muted">
                            {step.output}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Connector line between cards */}
                {index < steps.length - 1 && (
                  <div className="flex justify-start pl-3 py-0.5">
                    <div className="w-0.5 h-4 bg-amber-500/30 ml-3" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Step button */}
          <div className="p-4 border-t border-border">
            <button
              onClick={addStep}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md border border-dashed border-amber-500/40 text-amber-500 hover:bg-amber-500/10 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Step
            </button>
          </div>
        </div>

        {/* Right panel — step detail editor */}
        <div className="flex-1 p-6 bg-surface-raised">
          {selectedStep === null ? (
            <div className="flex items-center justify-center h-full min-h-48">
              <p className="text-sm text-text-muted">
                Select a step to edit, or add a new one
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-lg">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedStep.name}
                  onChange={(e) =>
                    updateStep(selectedStep.id, "name", e.target.value)
                  }
                  className="w-full bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-amber-500"
                  placeholder="Step name"
                />
              </div>

              {/* Skill reference */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Skill Reference
                </label>
                <input
                  type="text"
                  value={selectedStep.skill}
                  onChange={(e) =>
                    updateStep(selectedStep.id, "skill", e.target.value)
                  }
                  className="w-full font-mono bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-amber-500"
                  placeholder="skill-name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={selectedStep.description}
                  onChange={(e) =>
                    updateStep(selectedStep.id, "description", e.target.value)
                  }
                  className="w-full bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-amber-500 resize-none"
                  placeholder="What does this step do?"
                />
              </div>

              {/* Input */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Input
                </label>
                <input
                  type="text"
                  value={selectedStep.input}
                  onChange={(e) =>
                    updateStep(selectedStep.id, "input", e.target.value)
                  }
                  className="w-full bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-amber-500"
                  placeholder="What does this step receive?"
                />
              </div>

              {/* Output */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Output
                </label>
                <input
                  type="text"
                  value={selectedStep.output}
                  onChange={(e) =>
                    updateStep(selectedStep.id, "output", e.target.value)
                  }
                  className="w-full bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-amber-500"
                  placeholder="What does this step produce?"
                />
              </div>

              {/* Delete */}
              <div className="pt-2">
                <button
                  onClick={() => deleteStep(selectedStep.id)}
                  className="text-xs text-red-500 hover:text-red-400 transition-colors"
                >
                  Delete Step
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
