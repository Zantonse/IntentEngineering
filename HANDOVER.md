# HANDOVER — The Intent Workshop

## 1. Session Summary

This session built out the entire educational content and interactive components for The Intent Workshop (`intenteng.vercel.app`) — a Next.js site teaching Sales Engineers to build specialized AI agents with Claude Code skills. Starting from a site with only Module 1 (Foundations, 3 lessons), we added Modules 2-5 (17 more lessons), 3 interactive components, 2 reference pages, a working fact-checker skill, and went through two full fact-check passes correcting ~30 factual errors. The site is deployed to Vercel and builds clean. All changes are on `master`, uncommitted.

**Date:** 2026-02-28
**Branch:** `master`

---

## 2. What Got Done

### Content Created (20 lessons total across 5 modules)

**Module 2 — Building Skills (5 lessons)**
- `content/learn/building-skills/01-skill-creation-process.mdx` — 6-step process, three-questions test
- `content/learn/building-skills/02-building-your-first-skill.mdx` — End-to-end discovery-questions walkthrough, embeds `<SkillBuilder />`
- `content/learn/building-skills/03-se-skill-library.mdx` — 3 complete SE skills (demo-prep, rfp-response, post-call-followup)
- `content/learn/building-skills/04-testing-and-iterating.mdx` — Trigger/quality/boundary tests, friction log, iteration loop
- `content/learn/building-skills/05-using-skill-creator.mdx` — skill-creator plugin workflow, packaging, distribution

**Module 3 — Orchestration (3 lessons)**
- `content/learn/orchestration/01-what-is-orchestration.mdx` — 6 primitives, 6 patterns overview, state management
- `content/learn/orchestration/02-multi-step-workflows.mdx` — Post-call + RFP pipelines, embeds `<OrchestrationFlowEditor />`
- `content/learn/orchestration/03-orchestration-patterns.mdx` — 6 patterns deep dive + evaluator-optimizer bonus

**Module 4 — Intent Engineering (4 lessons)**
- `content/learn/intent-engineering/01-the-intent-engineering-stack.mdx` — Prompt→context→intent progression, Klarna case study
- `content/learn/intent-engineering/02-context-engineering.mdx` — Write/Select/Compress/Isolate strategies
- `content/learn/intent-engineering/03-memory-goals-constraints.mdx` — Memory hierarchy, goal decomposition, constraint priorities
- `content/learn/intent-engineering/04-evaluation-and-system-design.mdx` — CLEAR framework, 3 eval loops, embeds `<IntentArchitectDesigner />`

**Module 5 — Building Your SE Agent (5 lessons)**
- `content/learn/building-your-agent/01-designing-your-skill-library.mdx` — 4-tier skill taxonomy, 5 design patterns, Claude Code setup
- `content/learn/building-your-agent/02-connecting-to-real-tools.mdx` — MCP integrations, dynamic injection, hooks
- `content/learn/building-your-agent/03-account-context-systems.mdx` — Per-account YAML schema, CLAUDE.md hierarchy, scaling
- `content/learn/building-your-agent/04-deploying-and-measuring.mdx` — Plugins, feedback loop, measurement tiers
- `content/learn/building-your-agent/05-exercise-building-a-verification-skill.mdx` — Hands-on fact-checker skill build exercise

### Interactive Components Created
- `components/interactive/SkillBuilder.tsx` — SKILL.md form/editor with 6 validation rules, preview, copy
- `components/interactive/OrchestrationFlowEditor.tsx` — Workflow step editor with 2 SE presets
- `components/interactive/IntentArchitectDesigner.tsx` — 5-layer intent system designer with 2 presets

### Reference Pages Created
- `content/reference/se-skill-library.mdx` — 15-skill taxonomy, design pattern quick-reference, directory structure
- `content/reference/mcp-integration-guide.mdx` — 3-tier MCP integration tables, config examples, auth notes

### Fact-Checker Skill Created
- `.claude/skills/fact-checker/SKILL.md` — Project-level skill
- `~/.claude/skills/fact-checker/SKILL.md` — User-level (available everywhere)
- Uses parallel subagent architecture for context-isolated verification

### Structural Code Changes
- `lib/mdx.ts` — Added imports/registration for SkillBuilder, OrchestrationFlowEditor, IntentArchitectDesigner
- `lib/constants.ts` — Added `building-your-agent` module (order: 5, color: `--color-mod-practice` red)
- `app/globals.css` — Added `--color-mod-practice: #ef4444`
- `app/reference/page.tsx` — Added `se-skill-library` and `mcp-integration-guide` to REFERENCE_META

### Agent Framing Rewrite
- `components/landing/HeroSection.tsx` — "From prompts to systems" → "Turn Claude Code into your SE agent"
- `components/landing/LayerDiagram.tsx` — Layer descriptions rewritten for agent framing
- `components/landing/ModuleCards.tsx` — Section intro rewritten
- `app/learn/page.tsx` — Subtitle rewritten
- `app/layout.tsx` — Meta description updated
- `lib/constants.ts` — All 4 original module subtitles/descriptions rewritten for agent framing
- `content/learn/foundations/01-what-are-skills.mdx` — "SE copilot" → "SE agent", all 4 layers reframed
- `content/learn/orchestration/01-what-is-orchestration.mdx` — Agent framing in key payoff sentences
- `content/learn/intent-engineering/01-the-intent-engineering-stack.mdx` — Intent engineering as agent deployment
- `content/learn/intent-engineering/04-evaluation-and-system-design.mdx` — Course close rewritten
- `content/reference/glossary.mdx` — Added "Agent (Specialized)" entry

### Fact-Check Fixes (2 full passes, ~30 corrections)
See "Lessons Learned" for the full list of error categories found and fixed.

---

## 3. What Didn't Work / Bugs Encountered

- **No build failures.** Every deploy passed clean on first try.
- **No runtime errors found** — interactive components were not tested in-browser during this session, only via build verification.
- **Fabricated GitHub reference** — `alirezarezvani/claude-skills` was cited as a real SE skill repository in an early content pass. Could not be verified. Removed and replaced with honest ecosystem assessment.
- **`.skill` file extension** — Early content described a `.skill` packaging format. The actual output of `package_skill.py` is `.zip`. Corrected.
- **"plugin-dev toolkit"** — Invented product name for the skill-creator's distribution mechanism. No product by that name exists. Changed to "available as a Claude Code plugin."

---

## 4. Key Decisions Made

1. **Agent framing as the narrative spine.** The site was repositioned from "prompts to systems" to "turn Claude Code into your SE agent." Skills = expertise, orchestration = autonomy, intent engineering = accountability. This framing runs through hero, module descriptions, and lesson content.

2. **5 modules, not 4.** Module 5 ("Building Your SE Agent") was added as a practical capstone after research showed the first 4 modules were too theoretical. Module 5 covers skill library design, MCP integrations, account context systems, measurement, and a hands-on exercise.

3. **Parallel subagent fact-checker.** The fact-checker skill was redesigned from single-agent to parallel subagent architecture after the first run showed context rot degrading verification quality on later files. Each file group gets its own clean context window.

4. **Official docs as ground truth.** Throughout fact-checking, `code.claude.com` was treated as the canonical source. Claims that contradicted official docs were corrected even when third-party sources supported them.

5. **"Recommended" not "hard" for 500-line ceiling.** The official Claude Code docs describe the 500-line SKILL.md limit as "for optimal performance," not an enforced technical limit. All content was updated to say "recommended ceiling."

6. **Removed all unsourced statistics.** The "1,500-2,000 words" body target (not in any official doc), "~40 skills" limit (fabricated calculation), and "30%" rewrite threshold (invented metric) were all removed or corrected.

---

## 5. Lessons Learned / Gotchas

### Factual Error Categories Found Across 2 Passes

These are the categories of errors that AI-generated educational content consistently produces. The next session should watch for them:

| Category | Examples Found | Root Cause |
|---|---|---|
| Fabricated tool/repo names | `alirezarezvani/claude-skills` | AI generates plausible-sounding names |
| Invented metrics | "~40 skills", "30%", "1,500-2,000 words" | AI derives numbers from real data then presents derived values as documented |
| Overstated feature status | HubSpot "GA" (actually beta), Gmail "official" (actually community) | AI defaults to the most confident framing |
| Wrong attribution | Galileo cited for McKinsey data, Slack MCP attributed to Anthropic | AI merges secondary sources into primary citations |
| Outdated numbers | Composio "250+" (now 850+), Zapier "7,000+" (now 8,000+) | Research data goes stale between research and content creation |
| Invented product names | "plugin-dev toolkit" | AI names unnamed things |
| Spec vs. platform confusion | `version` as top-level field (spec doesn't support it), frontmatter key list (base spec vs Claude Code extensions) | AI conflates the Agent Skills spec with Claude Code's extended implementation |

### Claude Code Documentation Gotchas

- **Commands merged into skills** — The official docs say `.claude/commands/` and `.claude/skills/` both create slash commands now. Commands are a legacy alias. Many online tutorials still describe them as separate primitives.
- **"Agents" vs "subagents"** — The official term is "subagents" (page: `code.claude.com/docs/en/sub-agents`). Most community content says "agents."
- **Agent Teams are peer-cooperative, not orchestrator-worker** — The official model is shared task list + direct peer messaging, not top-down delegation.
- **`paths` YAML frontmatter** — Documented as a feature for scoping rules to file patterns, but has open GitHub bug reports (#22170, #16853) suggesting it may not load automatically in practice.
- **`disable-model-invocation: true` removes description from context entirely** — Not just "prevents auto-triggering." The description is completely absent from the context window when this flag is set.

---

## 6. Current State

- **Build:** Passes clean (`npm run build` — 0 errors, 0 warnings)
- **Deployed:** `https://intenteng.vercel.app` — production, all content live
- **Uncommitted changes:** Yes — ALL work from this session is uncommitted. See git status below.
- **Branch:** `master`
- **Latest commit:** `f22a257 feat: add reference section with glossary` (pre-session)
- **No tests configured** — this is a content site with no test suite

### Files Modified (tracked)
```
app/globals.css
app/layout.tsx
app/learn/page.tsx
app/reference/page.tsx
components/landing/HeroSection.tsx
components/landing/LayerDiagram.tsx
components/landing/ModuleCards.tsx
content/learn/foundations/01-what-are-skills.mdx
content/learn/foundations/02-anatomy-of-a-skill.mdx
content/reference/glossary.mdx
lib/constants.ts
lib/mdx.ts
```

### Files Created (untracked)
```
.claude/skills/fact-checker/SKILL.md
components/interactive/IntentArchitectDesigner.tsx
components/interactive/OrchestrationFlowEditor.tsx
components/interactive/SkillBuilder.tsx
content/learn/building-skills/ (5 files)
content/learn/building-your-agent/ (5 files)
content/learn/intent-engineering/ (4 files)
content/learn/orchestration/ (3 files)
content/reference/mcp-integration-guide.mdx
content/reference/se-skill-library.mdx
```

---

## 7. Clear Next Steps

1. **Commit all changes.** Everything is deployed to Vercel but not committed to git. A single large commit or a series of logical commits (components, Module 2, Module 3, Module 4, agent framing, Module 5, references, fact-check fixes) would both work.

2. **Browser-test the interactive components.** SkillBuilder, OrchestrationFlowEditor, and IntentArchitectDesigner were verified via build but not tested in a live browser. Check: preset loading, form validation, copy buttons, responsive layout on mobile.

3. **Add a "Before You Start" / prerequisites page.** The content audit identified this as the biggest entry barrier. A standalone page covering Claude Code installation, API key setup, and "what a working skill directory looks like" would expand the addressable audience.

4. **Add before/after evidence.** The audit found zero social proof or concrete examples of the agent actually working. A single case study (even fictionalized) showing SE workflow before vs. after skill-based agent would significantly strengthen the value proposition.

5. **Address remaining LOW findings.** The Karpathy quote truncation, `paths` feature caveat, and "This skill should be used when..." as one-of-many third-person formats are acceptable but could be improved.

6. **Consider adding progress tracking.** The site functions as a course but has no progress indicators, completion states, or checkpoints. Even a simple localStorage-based "lessons read" tracker would improve the learning experience.

7. **Test the fact-checker skill in a fresh session.** The skill is at `~/.claude/skills/fact-checker/SKILL.md` and should be invokable with `/fact-checker` from any Claude Code session. Verify it triggers correctly and dispatches parallel subagents as designed.

---

## 8. Important Files Map

| File | Description |
|---|---|
| `lib/constants.ts` | Module metadata — slugs, titles, subtitles, colors, order. Adding a module = one entry here. |
| `lib/mdx.ts` | MDX compilation pipeline. Interactive components must be imported and registered in `getMDXComponents()`. |
| `app/globals.css` | Design tokens. Module colors: `--color-mod-foundations` (blue), `--color-mod-building` (green), `--color-mod-orchestration` (amber), `--color-mod-intent` (purple), `--color-mod-practice` (red). |
| `app/reference/page.tsx` | Reference index. New reference pages need an entry in `REFERENCE_META` dict for proper display. |
| `components/interactive/SkillAnatomyExplorer.tsx` | Module 1 interactive — pattern reference for all other interactive components. |
| `components/interactive/SkillBuilder.tsx` | Module 2 interactive — SKILL.md form editor with validation. |
| `components/interactive/OrchestrationFlowEditor.tsx` | Module 3 interactive — workflow step editor with presets. |
| `components/interactive/IntentArchitectDesigner.tsx` | Module 4 interactive — 5-layer intent architecture designer. |
| `.claude/skills/fact-checker/SKILL.md` | Project-level fact-checker skill (parallel subagent architecture). |
| `~/.claude/skills/fact-checker/SKILL.md` | User-level copy — available in all projects. |
| `content/learn/*/` | Lesson MDX files. Auto-discovered by `getLessonsByModule()` via filesystem. |
| `content/reference/` | Reference MDX files. Auto-discovered by `getReferenceSlugs()`. |
| `components/landing/HeroSection.tsx` | Landing page hero — contains the site's primary value proposition copy. |
| `components/Sidebar.tsx` + `SidebarNav.tsx` | Sidebar navigation — auto-discovers modules and lessons from `MODULE_META`. |
