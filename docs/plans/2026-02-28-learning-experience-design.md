# Learning Experience Improvements — Design Document

**Date:** 2026-02-28
**Approach:** Content-First Layering (A)
**Scope:** 7 new components + 1 build script + 2 rehype plugins + MDX content updates

## Problem

Three pain points when learning from the Intent Workshop content:

1. **Hard to find things** — no search, no in-page navigation, no concept cross-referencing
2. **Walls of text** — lessons are dense with no visual hierarchy beyond headings
3. **Can't practice/apply** — no way to test understanding for conceptual lessons

## Design

### Phase 1 — Content Structure

Four new MDX-embeddable components that break up dense content and add structure.

#### `<Callout>` — Visual callout boxes

Four variants: `key`, `tip`, `warning`, `example`. Each gets a distinct left-border color, icon, and label.

```mdx
<Callout type="key">
Skills are packaged domain workflows — the difference between Claude as a general assistant and Claude as your SE agent.
</Callout>
```

**Visual:** Left-border accent (key=blue, tip=green, warning=amber, example=purple), icon, bold label, muted background. Dark mode compatible via semantic tokens.

#### `<Details>` — Collapsible sections

Styled `<details>`/`<summary>` for optional deep-dives. Collapsed by default.

```mdx
<Details title="Deep Dive: Progressive Disclosure internals">
Extended technical explanation...
</Details>
```

**Visual:** Subtle border, chevron icon that rotates on open, slightly indented content area.

#### `<KeyTakeaways>` — End-of-lesson summary

Structured card at the end of each lesson with the essential points.

```mdx
<KeyTakeaways items={[
  "Skills are packaged domain workflows that encode institutional SE knowledge",
  "Progressive disclosure uses 3 layers: metadata → body → references",
  "Keep SKILL.md under 500 lines and 5,000 tokens"
]} />
```

**Visual:** Card with gradient border (matching site's `card-gradient-border` pattern), bullet list, distinct heading.

#### `<TableOfContents>` — Auto-generated in-lesson TOC

- Rehype plugin (`rehype-slug` or custom) adds `id` attributes to h2/h3 headings during MDX compilation
- Client component reads heading IDs from the DOM and renders a clickable anchor list
- Placed between lesson title/description and lesson content
- Highlights current section on scroll (Intersection Observer)

### Phase 2 — Discovery

#### Full-text Search (`<SearchDialog>`)

**Build step:** A Next.js build script scans all `.mdx` files and produces `/public/search-index.json` containing:
- Lesson title, description, module slug, module title
- Heading text (for section-level results)
- Plain-text body (MDX syntax stripped)

**Client component:** `<SearchDialog>` modal triggered by:
- Search icon in TopBar
- `Cmd+K` / `Ctrl+K` keyboard shortcut

**Search library:** Fuse.js (~7KB gzipped) for client-side fuzzy matching.

**Results display:** Lesson title, module badge (color-coded), context snippet with highlighted match, direct link. Clicking navigates and closes the dialog.

#### Glossary Term Auto-linking (`<GlossaryTerm>`)

**Build step:** Extract term definitions from `content/reference/glossary.mdx` frontmatter or body structure.

**Rehype plugin:** During lesson MDX compilation, scan paragraph text nodes for glossary terms. Wrap the first occurrence of each term per lesson in a `<GlossaryTerm>` component.

**Component behavior:**
- Shows a dotted underline on the term
- Hover/focus reveals a tooltip with the short definition
- Click navigates to the glossary page anchored to that term
- Only first occurrence per lesson to avoid clutter

### Phase 3 — Practice

#### `<KnowledgeCheck>` — Multiple-choice concept checks

```mdx
<KnowledgeCheck
  question="What determines when a skill's full body loads into context?"
  options={[
    "The skill's filename",
    "The skill's trigger description matching the user's request",
    "The order defined in CLAUDE.md",
    "The skill's file size"
  ]}
  correct={1}
  explanation="The trigger description in the skill's frontmatter is what Claude evaluates to decide whether to load the skill body."
/>
```

**Behavior:**
- Radio-button options, single selection
- On selection: immediately reveals correct/incorrect state
- Always shows explanation after answering (learning > scoring)
- No scoring, no persistence — purely self-assessment
- Styled with module accent color

**Placement:** 1-3 per lesson at natural break points after major concepts.

#### `<SelfAssessment>` — End-of-lesson confidence checklist

```mdx
<SelfAssessment items={[
  "I can explain the difference between a skill and a prompt",
  "I can describe the three-layer loading model",
  "I understand why trigger descriptions matter for context management"
]} />
```

**Behavior:**
- Checkbox list the learner checks as they feel confident
- State persisted in localStorage (keyed by `${moduleSlug}/${lessonSlug}`)
- Shows small progress: "2 of 3 confident"
- Purely self-directed — no right/wrong
- localStorage writes wrapped in try/catch per project guidelines

**Placement:** End of each lesson, after KeyTakeaways, before LessonNav.

## Out of Scope

- Progress tracking (lesson visited/completed states)
- User authentication or backend
- Scoring or grading systems
- Changes to existing interactive components (SkillBuilder, etc.)

## Technical Notes

- All new components are client components (`'use client'`) registered in `getMDXComponents()` in `lib/mdx.ts`
- Search index generated via a build script in `scripts/build-search-index.ts`, run as part of the Next.js build
- Glossary extraction and auto-linking happens during MDX compilation via rehype
- All localStorage usage follows project guidelines: try/catch on writes, JSON.parse wrapped, graceful defaults
- Design tokens from `globals.css` used throughout — no hardcoded colors
- Dark mode support via existing semantic token system
