"use client";

import { useState, useMemo } from "react";

interface ValidationResult {
  id: string;
  pass: boolean;
  message: string;
}

export function SkillBuilder() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [body, setBody] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const wordCount = useMemo(() => {
    const trimmed = body.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [body]);

  const validations = useMemo<ValidationResult[]>(() => {
    const nameValid = /^[a-z][a-z0-9-]*$/.test(name);
    const descThirdPerson = description.startsWith("This skill should be used when");
    const descHasQuotes = /"[^"]+"/.test(description);
    const descLength = description.length > 60;

    let bodyWordMsg = "Word count OK";
    let bodyWordPass = wordCount >= 300 && wordCount <= 2000;
    if (wordCount < 300) bodyWordMsg = "Too short";
    if (wordCount > 2000) bodyWordMsg = "Too long — move detail to references/";

    const bodyImperative = !/you should/i.test(body);

    return [
      {
        id: "name-format",
        pass: nameValid,
        message: nameValid ? "Valid skill name" : "Use lowercase letters and hyphens only",
      },
      {
        id: "desc-third-person",
        pass: descThirdPerson,
        message: descThirdPerson ? "Third-person format ✓" : "Must use third-person format",
      },
      {
        id: "desc-quotes",
        pass: descHasQuotes,
        message: descHasQuotes ? "Has trigger phrases ✓" : "Include quoted trigger phrases",
      },
      {
        id: "desc-length",
        pass: descLength,
        message: descLength ? "Description length OK" : "Too short — add more trigger phrases",
      },
      {
        id: "body-word-count",
        pass: bodyWordPass,
        message: bodyWordMsg,
      },
      {
        id: "body-imperative",
        pass: bodyImperative,
        message: bodyImperative ? "Imperative form ✓" : 'Use imperative form — avoid "you should"',
      },
    ];
  }, [name, description, body, wordCount]);

  const assembledSkill = useMemo(() => {
    return `---\nname: ${name}\ndescription: ${description}\nversion: ${version}\n---\n\n${body}`;
  }, [name, description, version, body]);

  function handleCopy() {
    navigator.clipboard.writeText(assembledSkill).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const passCount = validations.filter((v) => v.pass).length;

  return (
    <div className="my-8 card-gradient-border overflow-hidden">
      {/* Mac chrome header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-surface-raised border-b border-border">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-3 font-mono text-xs text-text-muted">new-skill/SKILL.md</span>
      </div>

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row">
        {/* Left panel — Frontmatter form */}
        <div className="lg:w-72 flex flex-col gap-5 p-5 border-b lg:border-b-0 lg:border-r border-border bg-surface-raised">
          <div className="text-xs font-semibold text-mod-building uppercase tracking-wider mb-1">
            Frontmatter
          </div>

          {/* name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-skill-name"
              className="bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-mod-building"
            />
          </div>

          {/* description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='This skill should be used when...'
              className="bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-mod-building resize-none"
            />
          </div>

          {/* version */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              version
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="0.1.0"
              className="bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-mod-building"
            />
          </div>
        </div>

        {/* Right panel — Body textarea */}
        <div className="flex-1 flex flex-col p-5 bg-surface-raised">
          <div className="text-xs font-semibold text-mod-building uppercase tracking-wider mb-3">
            Body
          </div>
          <div className="relative flex-1">
            <textarea
              rows={16}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={"# Skill Title\n\nDescribe what this skill does...\n\n## Process\n\n1. First step..."}
              className="w-full bg-surface-overlay border border-border rounded-md px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-mod-building resize-none"
            />
            <div className="absolute bottom-3 right-3 text-xs text-text-muted font-mono pointer-events-none">
              {wordCount} / 2000 words
            </div>
          </div>
        </div>
      </div>

      {/* Bottom panel — Validation + Preview */}
      <div className="border-t border-border bg-surface-raised">
        {/* Validation header row */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Validation
            </span>
            <span className="text-xs font-mono text-text-muted">
              {passCount}/{validations.length} checks passing
            </span>
          </div>
          <button
            onClick={() => setShowPreview((v) => !v)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
              showPreview
                ? "bg-mod-building/10 border-mod-building text-mod-building"
                : "bg-surface-overlay border-border text-text-secondary hover:border-mod-building hover:text-mod-building"
            }`}
          >
            {showPreview ? "Hide Preview" : "Preview"}
          </button>
        </div>

        {/* Validation rows */}
        <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {validations.map((v) => (
            <div key={v.id} className="flex items-center gap-2">
              {v.pass ? (
                <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-red-400 shrink-0" />
              )}
              <span
                className={`text-xs ${
                  v.pass ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                {v.message}
              </span>
            </div>
          ))}
        </div>

        {/* Preview overlay */}
        {showPreview && (
          <div className="mx-5 mb-5 rounded-md border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-surface-overlay border-b border-border">
              <span className="text-xs font-mono text-text-muted">SKILL.md preview</span>
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded text-xs font-semibold border border-border bg-surface-raised text-text-secondary hover:border-mod-building hover:text-mod-building transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-text-primary bg-surface-overlay overflow-x-auto whitespace-pre-wrap break-words">
              {assembledSkill}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
