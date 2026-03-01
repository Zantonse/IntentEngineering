# Learning Experience Improvements — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add content structure components (Callout, Details, KeyTakeaways, TOC), full-text search, glossary auto-linking, and practice components (KnowledgeCheck, SelfAssessment) to the Intent Workshop.

**Architecture:** New client components registered in the MDX component map (`lib/mdx.ts`), a build-time search index script, and a rehype plugin for heading IDs. All state is client-side (localStorage where needed). No backend changes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, next-mdx-remote/rsc, Fuse.js (new dep), rehype-slug (new dep)

**Design doc:** `docs/plans/2026-02-28-learning-experience-design.md`

---

## Phase 1 — Content Structure Components

### Task 1: Create `<Callout>` component

**Files:**
- Create: `components/learn/Callout.tsx`
- Modify: `lib/mdx.ts:7-10` (add import), `lib/mdx.ts:187-191` (register in component map)

**Step 1: Create the Callout component**

Create `components/learn/Callout.tsx`:

```tsx
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
```

**Step 2: Register in MDX component map**

In `lib/mdx.ts`, add the import at the top (after line 10):

```ts
import { Callout } from "@/components/learn/Callout";
```

Then add `Callout` to the return object in `getMDXComponents()` (after line 190, alongside the existing interactive components):

```ts
    Callout,
```

**Step 3: Verify it works**

Run: `npm run dev`

Edit any MDX file temporarily (e.g., `content/learn/foundations/01-what-are-skills.mdx`) by adding at the end before the last paragraph:

```mdx
<Callout type="key">
Skills aren't about making Claude smarter. They're about turning it into your agent.
</Callout>
```

Verify the callout renders at `http://localhost:3000/learn/foundations/what-are-skills` with a blue left border, light blue background, and the "Key Concept" label.

Remove the test content.

**Step 4: Commit**

```bash
git add components/learn/Callout.tsx lib/mdx.ts
git commit -m "feat: add Callout component for visual callout boxes in lessons"
```

---

### Task 2: Create `<Details>` component

**Files:**
- Create: `components/learn/Details.tsx`
- Modify: `lib/mdx.ts` (add import + register)

**Step 1: Create the Details component**

Create `components/learn/Details.tsx`:

```tsx
"use client";

import { type ReactNode } from "react";

interface DetailsProps {
  title: string;
  children: ReactNode;
}

export function Details({ title, children }: DetailsProps) {
  return (
    <details className="group my-6 rounded-lg border border-border bg-surface-raised">
      <summary className="flex cursor-pointer items-center gap-2 px-5 py-3 text-sm font-semibold text-text-primary select-none">
        <svg
          className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {title}
      </summary>
      <div className="border-t border-border px-5 py-4 text-text-secondary leading-7 [&>p:last-child]:mb-0">
        {children}
      </div>
    </details>
  );
}
```

**Step 2: Register in MDX component map**

In `lib/mdx.ts`, add the import:

```ts
import { Details } from "@/components/learn/Details";
```

Add `Details` to the `getMDXComponents()` return object.

**Step 3: Verify with dev server**

Add to any MDX file temporarily:

```mdx
<Details title="Deep Dive: How progressive disclosure works internally">
When Claude processes a skill directory, it first reads only the frontmatter...
</Details>
```

Verify it renders collapsed with a chevron, and expands on click.

Remove the test content.

**Step 4: Commit**

```bash
git add components/learn/Details.tsx lib/mdx.ts
git commit -m "feat: add Details collapsible section component"
```

---

### Task 3: Create `<KeyTakeaways>` component

**Files:**
- Create: `components/learn/KeyTakeaways.tsx`
- Modify: `lib/mdx.ts` (add import + register)

**Step 1: Create the KeyTakeaways component**

Create `components/learn/KeyTakeaways.tsx`:

```tsx
"use client";

interface KeyTakeawaysProps {
  items: string[];
}

export function KeyTakeaways({ items }: KeyTakeawaysProps) {
  return (
    <div className="card-gradient-border my-8 px-6 py-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Key Takeaways
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-text-secondary leading-7">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Step 2: Register in MDX component map**

In `lib/mdx.ts`, add import and register `KeyTakeaways` in `getMDXComponents()`.

**Step 3: Verify with dev server**

Test in any MDX file:

```mdx
<KeyTakeaways items={[
  "Skills are packaged domain workflows",
  "Progressive disclosure uses 3 layers",
  "Keep SKILL.md under 500 lines"
]} />
```

Verify it renders with the gradient border card, checkmark icon header, and blue bullet points.

Remove the test content.

**Step 4: Commit**

```bash
git add components/learn/KeyTakeaways.tsx lib/mdx.ts
git commit -m "feat: add KeyTakeaways lesson summary component"
```

---

### Task 4: Add heading IDs via rehype-slug

**Files:**
- Modify: `package.json` (add dependency)
- Modify: `lib/mdx.ts:67-70` and `lib/mdx.ts:110-113` (add rehype plugin)

**Step 1: Install rehype-slug**

```bash
npm install rehype-slug
```

**Step 2: Add rehype-slug to MDX compilation**

In `lib/mdx.ts`, add the import:

```ts
import rehypeSlug from "rehype-slug";
```

In the `getLesson()` function, add `rehypeSlug` before `rehypePrettyCode` in the `rehypePlugins` array (around line 68):

```ts
rehypePlugins: [
  rehypeSlug,
  [rehypePrettyCode as any, { theme: "github-dark-default", keepBackground: true }],
],
```

Do the same in the `getReferencePage()` function (around line 111).

**Step 3: Verify headings get IDs**

Run `npm run dev`, navigate to any lesson, and inspect an h2 element. It should have an `id` attribute like `id="the-problem-with-general-purpose-ai"`.

**Step 4: Commit**

```bash
git add package.json package-lock.json lib/mdx.ts
git commit -m "feat: add rehype-slug for heading anchor IDs"
```

---

### Task 5: Create `<TableOfContents>` component

**Files:**
- Create: `components/learn/TableOfContents.tsx`
- Modify: `app/learn/[module]/[slug]/page.tsx` (add TOC between title and content)
- Modify: `lib/mdx.ts` (add heading extraction utility)

**Step 1: Add heading extraction to `lib/mdx.ts`**

Add a new export function to `lib/mdx.ts` that extracts headings from raw MDX content:

```ts
export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Extract h2/h3 headings from raw MDX content for table of contents.
 */
export function extractHeadings(rawContent: string): TocHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  let match;

  while ((match = headingRegex.exec(rawContent)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/\*\*(.+?)\*\*/g, "$1").replace(/`(.+?)`/g, "$1");
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
  }

  return headings;
}
```

**Step 2: Create the TableOfContents component**

Create `components/learn/TableOfContents.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/mdx";

interface TableOfContentsProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="mb-8 rounded-lg border border-border bg-surface-raised px-5 py-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
        On this page
      </h2>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block text-sm py-0.5 transition-colors ${
                heading.level === 3 ? "pl-4" : ""
              } ${
                activeId === heading.id
                  ? "text-electric-500 font-medium"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

**Step 3: Integrate TOC into lesson page**

Modify `app/learn/[module]/[slug]/page.tsx`. Add imports at the top:

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getLesson, getLessonsByModule, extractHeadings } from "@/lib/mdx";
import { TableOfContents } from "@/components/learn/TableOfContents";
```

In the function body, after `const lesson = await getLesson(moduleSlug, slug);`, add:

```ts
const rawPath = path.join(process.cwd(), "content", "learn", moduleSlug, `${slug}.mdx`);
const rawContent = fs.readFileSync(rawPath, "utf-8");
const { content: rawBody } = matter(rawContent);
const headings = extractHeadings(rawBody);
```

Then add `<TableOfContents headings={headings} />` between the lesson header and content:

```tsx
      <TableOfContents headings={headings} />

      <div className="prose-workshop">
```

**Step 4: Verify**

Navigate to a lesson with 3+ headings. The TOC should appear below the title. Clicking a heading should smooth-scroll to it. The current section should highlight as you scroll (html has `scroll-behavior: smooth` in globals.css already).

**Step 5: Commit**

```bash
git add components/learn/TableOfContents.tsx lib/mdx.ts app/learn/\\[module\\]/\\[slug\\]/page.tsx
git commit -m "feat: add auto-generated table of contents for lessons"
```

---

## Phase 2 — Discovery

### Task 6: Install Fuse.js

**Files:**
- Modify: `package.json`

**Step 1: Install Fuse.js**

```bash
npm install fuse.js
```

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add fuse.js for client-side search"
```

---

### Task 7: Create search index build script

**Files:**
- Create: `scripts/build-search-index.ts`
- Modify: `package.json` (update build script)

**Step 1: Create the build script**

Create `scripts/build-search-index.ts`:

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface SearchEntry {
  title: string;
  description: string;
  module: string;
  moduleTitle: string;
  slug: string;
  href: string;
  body: string;
  headings: string[];
}

const MODULE_TITLES: Record<string, string> = {
  foundations: "Foundations",
  "building-skills": "Building Skills",
  orchestration: "Orchestration",
  "intent-engineering": "Intent Engineering",
  "building-your-agent": "Building Your SE Agent",
};

const contentDir = path.join(process.cwd(), "content");

function stripMdx(content: string): string {
  return content
    .replace(/<[A-Z][^>]*\/>/g, "")
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractHeadingTexts(content: string): string[] {
  const regex = /^#{2,3}\s+(.+)$/gm;
  const headings: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    headings.push(
      match[1].replace(/\*\*(.+?)\*\*/g, "$1").replace(/`(.+?)`/g, "$1")
    );
  }
  return headings;
}

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const learnDir = path.join(contentDir, "learn");

  for (const moduleSlug of fs.readdirSync(learnDir)) {
    const moduleDir = path.join(learnDir, moduleSlug);
    if (!fs.statSync(moduleDir).isDirectory()) continue;

    for (const file of fs.readdirSync(moduleDir).filter((f) => f.endsWith(".mdx"))) {
      const filePath = path.join(moduleDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { content, data } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");

      entries.push({
        title: data.title || slug,
        description: data.description || "",
        module: moduleSlug,
        moduleTitle: MODULE_TITLES[moduleSlug] || moduleSlug,
        slug,
        href: `/learn/${moduleSlug}/${slug}`,
        body: stripMdx(content),
        headings: extractHeadingTexts(content),
      });
    }
  }

  const refDir = path.join(contentDir, "reference");
  if (fs.existsSync(refDir)) {
    for (const file of fs.readdirSync(refDir).filter((f) => f.endsWith(".mdx"))) {
      const filePath = path.join(refDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { content, data } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");

      entries.push({
        title: data.title || slug,
        description: data.description || "",
        module: "reference",
        moduleTitle: "Reference",
        slug,
        href: `/reference/${slug}`,
        body: stripMdx(content),
        headings: extractHeadingTexts(content),
      });
    }
  }

  return entries;
}

const index = buildIndex();
const outPath = path.join(process.cwd(), "public", "search-index.json");
fs.writeFileSync(outPath, JSON.stringify(index));
console.log(`Search index built: ${index.length} entries written to ${outPath}`);
```

**Step 2: Update build script in package.json**

In `package.json`, change the `build` script:

```json
"build": "npx tsx scripts/build-search-index.ts && next build"
```

**Step 3: Test the build script**

```bash
npx tsx scripts/build-search-index.ts
```

Expected output: `Search index built: 23 entries written to .../public/search-index.json`

Verify `public/search-index.json` exists and contains valid JSON.

**Step 4: Add search-index.json to .gitignore**

Append to `.gitignore`:

```
/public/search-index.json
```

**Step 5: Commit**

```bash
git add scripts/build-search-index.ts package.json .gitignore
git commit -m "feat: add build script to generate search index from MDX content"
```

---

### Task 8: Create `<SearchDialog>` component

**Files:**
- Create: `components/SearchDialog.tsx`
- Modify: `components/TopBar.tsx` (add search button)

**Step 1: Create SearchDialog component**

Create `components/SearchDialog.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

interface SearchEntry {
  title: string;
  description: string;
  module: string;
  moduleTitle: string;
  slug: string;
  href: string;
  body: string;
  headings: string[];
}

const MODULE_COLORS: Record<string, string> = {
  foundations: "bg-electric-500",
  "building-skills": "bg-mod-building",
  orchestration: "bg-amber-500",
  "intent-engineering": "bg-mod-intent",
  "building-your-agent": "bg-mod-practice",
  reference: "bg-slate-400",
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Fuse.FuseResult<SearchEntry>[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fuse, setFuse] = useState<Fuse<SearchEntry> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load search index on first open
  useEffect(() => {
    if (!open || fuse) return;

    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: SearchEntry[]) => {
        setFuse(
          new Fuse(data, {
            keys: [
              { name: "title", weight: 3 },
              { name: "headings", weight: 2 },
              { name: "description", weight: 1.5 },
              { name: "body", weight: 1 },
            ],
            includeMatches: true,
            threshold: 0.3,
            minMatchCharLength: 2,
          })
        );
      })
      .catch(() => {
        // Search index not available
      });
  }, [open, fuse]);

  // Cmd+K to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Search on query change
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    setResults(fuse.search(query, { limit: 8 }));
    setSelectedIndex(0);
  }, [query, fuse]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex].item.href);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <svg
            className="h-5 w-5 shrink-0 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search lessons, concepts, terms..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="hidden sm:inline-block rounded border border-border px-1.5 py-0.5 text-xs text-text-muted">
            esc
          </kbd>
        </div>

        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((result, i) => (
              <li key={result.item.href}>
                <button
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    i === selectedIndex
                      ? "bg-surface-overlay"
                      : "hover:bg-surface-raised"
                  }`}
                  onClick={() => navigate(result.item.href)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      MODULE_COLORS[result.item.module] || "bg-slate-400"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-text-primary">
                      {result.item.title}
                    </div>
                    <div className="text-xs text-text-muted">
                      {result.item.moduleTitle}
                    </div>
                    {result.item.description && (
                      <div className="mt-0.5 truncate text-xs text-text-secondary">
                        {result.item.description}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim() && results.length === 0 && fuse && (
          <div className="px-4 py-8 text-center text-sm text-text-muted">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}

        {query.trim() && !fuse && (
          <div className="px-4 py-8 text-center text-sm text-text-muted">
            Loading search index...
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchButton() {
  return (
    <button
      onClick={() =>
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true })
        )
      }
      className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted hover:text-text-primary hover:border-text-muted transition-colors"
      aria-label="Search"
    >
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden sm:inline-block rounded border border-border px-1 py-0.5 text-xs">
        ⌘K
      </kbd>
    </button>
  );
}
```

**Step 2: Add SearchDialog and SearchButton to TopBar**

Modify `components/TopBar.tsx`. Add import:

```ts
import { SearchDialog, SearchButton } from "./SearchDialog";
```

Replace the `<ThemeToggle />` line (line 26) with:

```tsx
        <div className="flex items-center gap-3">
          <SearchButton />
          <ThemeToggle />
        </div>
        <SearchDialog />
```

**Step 3: Verify**

Run `npx tsx scripts/build-search-index.ts` then `npm run dev`.

- Search button appears in TopBar
- Cmd+K opens the dialog
- Type "progressive disclosure" — should find "What Are Skills?"
- Click result — navigates to lesson
- Escape closes dialog

**Step 4: Commit**

```bash
git add components/SearchDialog.tsx components/TopBar.tsx
git commit -m "feat: add Cmd+K search dialog with Fuse.js"
```

---

### Task 9: Create `<GlossaryTerm>` component and glossary extraction

**Files:**
- Create: `components/learn/GlossaryTerm.tsx`
- Create: `lib/glossary.ts`
- Modify: `lib/mdx.ts` (register component)

**Step 1: Create glossary extraction utility**

Create `lib/glossary.ts`:

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface GlossaryEntry {
  term: string;
  slug: string;
  definition: string;
}

let _cache: GlossaryEntry[] | null = null;

/**
 * Parse glossary.mdx and extract term/definition pairs.
 * Each ### heading is a term; the first paragraph after it is the definition.
 */
export function getGlossaryEntries(): GlossaryEntry[] {
  if (_cache) return _cache;

  const filePath = path.join(process.cwd(), "content", "reference", "glossary.mdx");
  if (!fs.existsSync(filePath)) return [];

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);

  const entries: GlossaryEntry[] = [];
  const lines = content.split("\n");

  let currentTerm = "";
  let collectingDef = false;
  let defLines: string[] = [];

  for (const line of lines) {
    const termMatch = line.match(/^###\s+(.+)$/);
    if (termMatch) {
      if (currentTerm && defLines.length > 0) {
        entries.push({
          term: currentTerm,
          slug: currentTerm
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-"),
          definition: defLines.join(" ").trim(),
        });
      }
      currentTerm = termMatch[1].trim();
      collectingDef = true;
      defLines = [];
      continue;
    }

    if (collectingDef) {
      if (
        line.startsWith(">") ||
        line.startsWith("##") ||
        line.startsWith("```")
      ) {
        collectingDef = false;
        continue;
      }
      const trimmed = line.trim();
      if (trimmed) {
        defLines.push(trimmed);
      } else if (defLines.length > 0) {
        collectingDef = false;
      }
    }
  }

  if (currentTerm && defLines.length > 0) {
    entries.push({
      term: currentTerm,
      slug: currentTerm
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-"),
      definition: defLines.join(" ").trim(),
    });
  }

  _cache = entries;
  return entries;
}
```

**Step 2: Create GlossaryTerm component**

Create `components/learn/GlossaryTerm.tsx`:

```tsx
"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

interface GlossaryTermProps {
  term: string;
  definition: string;
  slug: string;
  children: ReactNode;
}

export function GlossaryTerm({
  term,
  definition,
  slug,
  children,
}: GlossaryTermProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(true);
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setShowTooltip(false), 200);
  }

  return (
    <span
      className="relative inline"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span
        className="border-b border-dotted border-electric-500/50 cursor-help"
        tabIndex={0}
        onFocus={handleEnter}
        onBlur={handleLeave}
        aria-describedby={`glossary-${slug}`}
      >
        {children}
      </span>
      {showTooltip && (
        <div
          id={`glossary-${slug}`}
          role="tooltip"
          className="absolute bottom-full left-0 z-30 mb-2 w-72 rounded-lg border border-border bg-surface p-3 shadow-lg"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <div className="mb-1 text-xs font-semibold text-text-primary">
            {term}
          </div>
          <p className="text-xs leading-relaxed text-text-secondary">
            {definition}
          </p>
          <a
            href={`/reference/glossary#${slug}`}
            className="mt-2 inline-block text-xs text-electric-500 hover:underline"
          >
            View in glossary →
          </a>
        </div>
      )}
    </span>
  );
}
```

**Step 3: Register GlossaryTerm in MDX components**

In `lib/mdx.ts`, add the import and register `GlossaryTerm` in `getMDXComponents()`.

**Step 4: Verify**

Manually add a `<GlossaryTerm>` in any MDX file:

```mdx
The <GlossaryTerm term="Progressive Disclosure" slug="progressive-disclosure" definition="The skill loading model where content is loaded in layers.">progressive disclosure</GlossaryTerm> model is key.
```

Verify: dotted underline, tooltip on hover, glossary link works.

Remove the test content.

**Note:** Automatic glossary term detection via rehype plugin is deferred as a follow-up. Manual `<GlossaryTerm>` usage gives full control over which terms are linked.

**Step 5: Commit**

```bash
git add lib/glossary.ts components/learn/GlossaryTerm.tsx lib/mdx.ts
git commit -m "feat: add GlossaryTerm tooltip component and glossary extraction"
```

---

## Phase 3 — Practice Components

### Task 10: Create `<KnowledgeCheck>` component

**Files:**
- Create: `components/learn/KnowledgeCheck.tsx`
- Modify: `lib/mdx.ts` (add import + register)

**Step 1: Create the KnowledgeCheck component**

Create `components/learn/KnowledgeCheck.tsx`:

```tsx
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
```

**Step 2: Register in MDX component map**

In `lib/mdx.ts`, add the import and register `KnowledgeCheck`.

**Step 3: Verify**

Add to any MDX file:

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

Verify: options render, correct answer shows green, wrong shows red, explanation always appears.

Remove the test content.

**Step 4: Commit**

```bash
git add components/learn/KnowledgeCheck.tsx lib/mdx.ts
git commit -m "feat: add KnowledgeCheck multiple-choice component"
```

---

### Task 11: Create `<SelfAssessment>` component

**Files:**
- Create: `components/learn/SelfAssessment.tsx`
- Modify: `lib/mdx.ts` (add import + register)

**Step 1: Create the SelfAssessment component**

Create `components/learn/SelfAssessment.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";

interface SelfAssessmentProps {
  items: string[];
  lessonKey?: string;
}

function loadCheckedState(key: string, count: number): boolean[] {
  try {
    const stored = localStorage.getItem(`self-assessment:${key}`);
    if (!stored) return new Array(count).fill(false);
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length === count) return parsed;
    return new Array(count).fill(false);
  } catch {
    return new Array(count).fill(false);
  }
}

function saveCheckedState(key: string, state: boolean[]) {
  try {
    localStorage.setItem(`self-assessment:${key}`, JSON.stringify(state));
  } catch {
    // QuotaExceededError
  }
}

export function SelfAssessment({ items, lessonKey }: SelfAssessmentProps) {
  const [mounted, setMounted] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );

  const storageKey = useMemo(() => {
    if (lessonKey) return lessonKey;
    if (typeof window !== "undefined") {
      return window.location.pathname
        .replace(/^\/learn\//, "")
        .replace(/\/$/, "");
    }
    return "unknown";
  }, [lessonKey]);

  useEffect(() => {
    setChecked(loadCheckedState(storageKey, items.length));
    setMounted(true);
  }, [storageKey, items.length]);

  function toggle(index: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      saveCheckedState(storageKey, next);
      return next;
    });
  }

  const checkedCount = checked.filter(Boolean).length;

  return (
    <div className="my-8 rounded-lg border border-border bg-surface-raised p-6">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Self-Assessment
        </h3>
        {mounted && (
          <span className="text-xs text-text-muted">
            {checkedCount} of {items.length} confident
          </span>
        )}
      </div>
      <p className="mb-4 text-sm text-text-secondary">
        Check off each item as you feel confident about it.
      </p>

      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <button
              onClick={() => toggle(i)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                mounted && checked[i]
                  ? "border-electric-500 bg-electric-500 text-white"
                  : "border-text-muted hover:border-electric-500"
              }`}
              aria-label={`${checked[i] ? "Uncheck" : "Check"}: ${item}`}
            >
              {mounted && checked[i] && (
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <span
              className={`text-sm leading-relaxed ${
                mounted && checked[i]
                  ? "text-text-muted line-through"
                  : "text-text-secondary"
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Step 2: Register in MDX component map**

In `lib/mdx.ts`, add import and register `SelfAssessment`.

**Step 3: Verify**

Add to any MDX file:

```mdx
<SelfAssessment items={[
  "I can explain what a skill is",
  "I can describe the three-layer loading model",
  "I understand trigger descriptions"
]} />
```

Verify: checkboxes render, toggling works, counter updates, state persists on refresh.

Remove the test content.

**Step 4: Commit**

```bash
git add components/learn/SelfAssessment.tsx lib/mdx.ts
git commit -m "feat: add SelfAssessment confidence checklist component"
```

---

## Phase 4 — Content Integration

### Task 12: Add learning components to Lesson 1 (foundations/01-what-are-skills)

**Files:**
- Modify: `content/learn/foundations/01-what-are-skills.mdx`

This task is the template for how to update all lessons. Do this one first, verify, then apply the pattern to remaining lessons.

**Step 1: Add Callouts at key concepts**

- After "A skill is a packaged domain workflow." → `<Callout type="key">`
- The SKILL.md size limits → `<Callout type="warning">`
- Convert the blockquote at the end to `<Callout type="key">`

**Step 2: Add a Details block**

Wrap the directory structure section in `<Details title="Skill Directory Structure">`.

**Step 3: Add a KnowledgeCheck**

After the Progressive Disclosure section:

```mdx
<KnowledgeCheck
  question="In the progressive disclosure model, what determines when a skill's full body loads into context?"
  options={[
    "The skill always loads its full body on every message",
    "The skill's trigger description matches the user's request",
    "The user manually selects which skills to load",
    "Skills load alphabetically until context is full"
  ]}
  correct={1}
  explanation="The skill's description (in frontmatter) is always in context. When it matches the user's intent, the full body loads. This is why writing precise trigger descriptions matters."
/>
```

**Step 4: Add KeyTakeaways and SelfAssessment at the end**

```mdx
<KeyTakeaways items={[
  "Skills are packaged domain workflows that turn Claude from a general assistant into a specialized SE agent",
  "Intent engineering has 4 layers: prompts, skills, orchestration, full system design",
  "Progressive disclosure loads skills in 3 layers: metadata (always), body (on trigger), references (as needed)",
  "Keep SKILL.md lean — heavy content goes in references/"
]} />

<SelfAssessment items={[
  "I can explain what a skill is and why it matters for SE work",
  "I can describe the four layers of the intent engineering hierarchy",
  "I can explain the three-layer progressive disclosure model",
  "I understand why SKILL.md should stay lean and what goes in references/"
]} />
```

**Step 5: Verify the lesson renders correctly**

**Step 6: Commit**

```bash
git add content/learn/foundations/01-what-are-skills.mdx
git commit -m "feat: add learning components to What Are Skills lesson"
```

---

### Task 13: Add learning components to remaining lessons

**Files:**
- Modify: All 19 remaining `.mdx` lesson files in `content/learn/`

Apply the same pattern from Task 12. Commit per module:

```bash
git commit -m "feat: add learning components to Foundations lessons (2-3)"
git commit -m "feat: add learning components to Building Skills lessons"
git commit -m "feat: add learning components to Orchestration lessons"
git commit -m "feat: add learning components to Intent Engineering lessons"
git commit -m "feat: add learning components to Building Your SE Agent lessons"
```

---

### Task 14: Final verification

**Step 1: Build the search index**

```bash
npx tsx scripts/build-search-index.ts
```

**Step 2: Run the production build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 3: Smoke test with `npm start`**

Verify:
- TOC appears on lessons with 2+ headings
- Callouts, Details, KeyTakeaways render on updated lessons
- KnowledgeCheck works (select answer, see explanation)
- SelfAssessment persists across page refreshes
- Search dialog opens with Cmd+K, finds content, navigates
- GlossaryTerm renders (if manually added)
- All pages work in both light and dark mode

**Step 4: Commit any fixes**

```bash
git commit -m "fix: address issues found during final verification"
```
