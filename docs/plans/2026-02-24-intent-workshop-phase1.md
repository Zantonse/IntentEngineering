# The Intent Workshop — Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the foundation of "The Intent Workshop" — a Next.js + MDX learning site with the design system, landing page, sidebar navigation, Module 1 (3 lessons), SkillAnatomyExplorer interactive component, reference glossary, and dark mode, deployed to Vercel.

**Architecture:** Next.js 15 App Router with file-based MDX content loaded via next-mdx-remote/rsc. Content lives in a `content/` directory outside `app/`, rendered through dynamic `[slug]` routes. Tailwind CSS v4 for styling with CSS custom properties for the design token system. Dark mode via class-based toggling.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, next-mdx-remote, gray-matter (frontmatter parsing), Geist + Geist Mono fonts, Vercel deployment.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `mdx-components.tsx`, `.gitignore`

**Step 1: Initialize Next.js project**

Run:
```bash
cd /Users/craigverzosa/Documents/Personal/Vibes/Claude/intenteng
npx create-next-app@latest . --typescript --eslint --tailwind --app --src-dir=false --import-alias="@/*" --turbopack
```

Expected: Project files created, dependency installation completes.

**Step 2: Install MDX dependencies**

Run:
```bash
npm install next-mdx-remote gray-matter reading-time rehype-pretty-code shiki
```

- `next-mdx-remote` — Loads MDX from file system for RSC
- `gray-matter` — Parses YAML frontmatter from MDX files
- `reading-time` — Estimates reading time per lesson
- `rehype-pretty-code` + `shiki` — Syntax highlighting in code blocks

**Step 3: Install Geist fonts**

Run:
```bash
npm install geist
```

**Step 4: Configure next.config.ts for MDX**

Replace `next.config.ts` with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default nextConfig;
```

**Step 5: Configure PostCSS for Tailwind v4**

Verify `postcss.config.mjs` contains:

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**Step 6: Create mdx-components.tsx at project root**

```tsx
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
```

**Step 7: Verify dev server starts**

Run: `npm run dev`
Expected: Server starts on localhost:3000, default page renders.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 project with MDX and Tailwind v4"
```

---

### Task 2: Design Token System & Global Styles

**Files:**
- Modify: `app/globals.css`
- Create: `lib/constants.ts`

**Step 1: Define design tokens in globals.css**

Replace `app/globals.css` with the full design token system:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Base palette */
  --color-navy-950: #0a0e1a;
  --color-navy-900: #0f1629;
  --color-navy-800: #161d35;
  --color-navy-700: #1e2844;
  --color-navy-600: #2a3557;

  /* Slate/neutral */
  --color-slate-400: #8b95a9;
  --color-slate-300: #a8b2c4;
  --color-slate-200: #c8d0de;
  --color-slate-100: #e4e8ef;
  --color-slate-50: #f3f5f8;

  /* Electric blue (primary) */
  --color-electric-500: #3b82f6;
  --color-electric-400: #60a5fa;
  --color-electric-300: #93bbfd;

  /* Warm amber (secondary) */
  --color-amber-500: #f59e0b;
  --color-amber-400: #fbbf24;
  --color-amber-300: #fcd34d;

  /* Module accent colors */
  --color-mod-foundations: #3b82f6;
  --color-mod-building: #22c55e;
  --color-mod-orchestration: #f59e0b;
  --color-mod-intent: #a855f7;

  /* Semantic tokens */
  --color-surface: #ffffff;
  --color-surface-raised: #f8f9fb;
  --color-surface-overlay: #f3f5f8;
  --color-text-primary: #0f1629;
  --color-text-secondary: #4b5563;
  --color-text-muted: #8b95a9;
  --color-border: #e4e8ef;
  --color-border-subtle: #f3f5f8;

  /* Font families */
  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;

  /* Spacing scale (workshop grid) */
  --spacing-workshop: 8px;
}

/* Dark mode semantic overrides */
.dark {
  --color-surface: #0f1629;
  --color-surface-raised: #161d35;
  --color-surface-overlay: #1e2844;
  --color-text-primary: #e4e8ef;
  --color-text-secondary: #a8b2c4;
  --color-text-muted: #6b7589;
  --color-border: #2a3557;
  --color-border-subtle: #1e2844;
}

/* Base styles */
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

/* Blueprint grid background pattern */
.bg-blueprint {
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
  background-size: 32px 32px;
}

.dark .bg-blueprint {
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.06) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* Gradient border utility for cards */
.card-gradient-border {
  position: relative;
  border-radius: 12px;
  background: var(--color-surface-raised);
}

.card-gradient-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3));
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}
```

**Step 2: Create constants file**

Create `lib/constants.ts`:

```typescript
export const MODULE_META = {
  foundations: {
    title: "Foundations",
    subtitle: "What Are Skills?",
    description: "Understand what skills are, how they work, and why they exist.",
    color: "var(--color-mod-foundations)",
    colorClass: "text-electric-500",
    bgClass: "bg-electric-500",
    icon: "puzzle",
    slug: "foundations",
    order: 1,
  },
  "building-skills": {
    title: "Building Skills",
    subtitle: "From Idea to Skill",
    description: "Learn the 6-step process for creating effective skills.",
    color: "var(--color-mod-building)",
    colorClass: "text-mod-building",
    bgClass: "bg-mod-building",
    icon: "wrench",
    slug: "building-skills",
    order: 2,
  },
  orchestration: {
    title: "Orchestration",
    subtitle: "Composing Skills Into Workflows",
    description: "Chain skills together with routing, handoffs, and state management.",
    color: "var(--color-mod-orchestration)",
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500",
    icon: "flow",
    slug: "orchestration",
    order: 3,
  },
  "intent-engineering": {
    title: "Intent Engineering",
    subtitle: "Designing the Full System",
    description: "Design complete intent systems with goals, constraints, memory, and evaluation.",
    color: "var(--color-mod-intent)",
    colorClass: "text-mod-intent",
    bgClass: "bg-mod-intent",
    icon: "compass",
    slug: "intent-engineering",
    order: 4,
  },
} as const;

export type ModuleSlug = keyof typeof MODULE_META;
```

**Step 3: Commit**

```bash
git add app/globals.css lib/constants.ts
git commit -m "feat: add design token system and module constants"
```

---

### Task 3: Root Layout with Fonts and Dark Mode Toggle

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/ThemeProvider.tsx`, `components/ThemeToggle.tsx`

**Step 1: Create ThemeProvider component**

Create `components/ThemeProvider.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    } catch {
      // localStorage unavailable, use default
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // QuotaExceededError — skip save
    }
  }, [theme, mounted]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Step 2: Create ThemeToggle component**

Create `components/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );
}
```

**Step 3: Update root layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Intent Workshop",
  description: "From prompts to systems. A guide for sales engineers building AI-powered workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Step 4: Verify dev server**

Run: `npm run dev`
Expected: Page renders with Geist fonts. Toggle dark mode in browser devtools by adding/removing `dark` class on `<html>`.

**Step 5: Commit**

```bash
git add app/layout.tsx components/ThemeProvider.tsx components/ThemeToggle.tsx
git commit -m "feat: add root layout with Geist fonts and dark mode"
```

---

### Task 4: MDX Content Pipeline

**Files:**
- Create: `lib/mdx.ts`, `content/learn/foundations/01-what-are-skills.mdx` (placeholder)

**Step 1: Create the MDX utility library**

Create `lib/mdx.ts`:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

const contentDir = path.join(process.cwd(), "content");

export interface LessonFrontmatter {
  title: string;
  description: string;
  order: number;
  module: string;
  readingTime?: string;
}

export interface LessonMeta {
  slug: string;
  frontmatter: LessonFrontmatter;
}

/**
 * Get all lessons for a given module slug (e.g., "foundations").
 */
export function getLessonsByModule(moduleSlug: string): LessonMeta[] {
  const dir = path.join(contentDir, "learn", moduleSlug);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const filePath = path.join(dir, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      const slug = filename.replace(/\.mdx$/, "");

      return {
        slug,
        frontmatter: data as LessonFrontmatter,
      };
    })
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

/**
 * Get a single lesson's compiled MDX content and frontmatter.
 */
export async function getLesson(moduleSlug: string, lessonSlug: string) {
  const filePath = path.join(contentDir, "learn", moduleSlug, `${lessonSlug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);

  const { content: mdxContent } = await compileMDX<LessonFrontmatter>({
    source: content,
    options: {
      mdxOptions: {
        rehypePlugins: [
          [rehypePrettyCode, { theme: "github-dark-default", keepBackground: true }],
        ],
      },
    },
    components: getMDXComponents(),
  });

  return {
    content: mdxContent,
    frontmatter: data as LessonFrontmatter,
  };
}

/**
 * Get all reference page slugs.
 */
export function getReferenceSlugs(): string[] {
  const dir = path.join(contentDir, "reference");

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/**
 * Get a single reference page.
 */
export async function getReferencePage(slug: string) {
  const filePath = path.join(contentDir, "reference", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        rehypePlugins: [
          [rehypePrettyCode, { theme: "github-dark-default", keepBackground: true }],
        ],
      },
    },
    components: getMDXComponents(),
  });

  return {
    content: mdxContent,
    frontmatter: data as { title: string; description: string },
  };
}

/**
 * MDX component overrides — custom styling for rendered content.
 */
function getMDXComponents() {
  return {
    h1: (props: React.ComponentProps<"h1">) => (
      <h1 className="text-3xl font-bold tracking-tight text-text-primary mt-8 mb-4" {...props} />
    ),
    h2: (props: React.ComponentProps<"h2">) => (
      <h2 className="text-2xl font-semibold tracking-tight text-text-primary mt-8 mb-3 pb-2 border-b border-border" {...props} />
    ),
    h3: (props: React.ComponentProps<"h3">) => (
      <h3 className="text-xl font-semibold text-text-primary mt-6 mb-2" {...props} />
    ),
    p: (props: React.ComponentProps<"p">) => (
      <p className="text-text-secondary leading-7 mb-4" {...props} />
    ),
    ul: (props: React.ComponentProps<"ul">) => (
      <ul className="text-text-secondary leading-7 mb-4 ml-6 list-disc" {...props} />
    ),
    ol: (props: React.ComponentProps<"ol">) => (
      <ol className="text-text-secondary leading-7 mb-4 ml-6 list-decimal" {...props} />
    ),
    li: (props: React.ComponentProps<"li">) => (
      <li className="mb-1" {...props} />
    ),
    code: (props: React.ComponentProps<"code">) => (
      <code className="bg-surface-overlay rounded px-1.5 py-0.5 font-mono text-sm text-electric-400" {...props} />
    ),
    pre: (props: React.ComponentProps<"pre">) => (
      <pre className="rounded-lg border border-border overflow-x-auto mb-4" {...props} />
    ),
    blockquote: (props: React.ComponentProps<"blockquote">) => (
      <blockquote className="border-l-4 border-electric-500 pl-4 my-4 text-text-muted italic" {...props} />
    ),
    strong: (props: React.ComponentProps<"strong">) => (
      <strong className="font-semibold text-text-primary" {...props} />
    ),
  };
}
```

**Step 2: Create a placeholder MDX file to test the pipeline**

Create `content/learn/foundations/01-what-are-skills.mdx`:

```mdx
---
title: "What Are Skills?"
description: "Understanding the building blocks of intent engineering — what skills are, why they exist, and the progressive disclosure model."
order: 1
module: "foundations"
---

# What Are Skills?

Skills are the building blocks of intent engineering. This is a placeholder — full content coming in Task 8.
```

**Step 3: Verify MDX loading works**

Create a temporary test: modify `app/page.tsx` to import and render the placeholder.

Run: `npm run dev` — verify no compile errors.

**Step 4: Commit**

```bash
git add lib/mdx.ts content/learn/foundations/01-what-are-skills.mdx
git commit -m "feat: add MDX content pipeline with frontmatter and syntax highlighting"
```

---

### Task 5: Layout Shell — TopBar, Sidebar, Content Area

**Files:**
- Create: `components/TopBar.tsx`, `components/Sidebar.tsx`, `components/SidebarNav.tsx`, `app/learn/layout.tsx`

**Step 1: Create TopBar component**

Create `components/TopBar.tsx`:

```tsx
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-text-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-electric-500">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span>The Intent Workshop</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/learn" className="text-text-secondary hover:text-text-primary transition-colors">
              Learn
            </Link>
            <Link href="/reference" className="text-text-secondary hover:text-text-primary transition-colors">
              Reference
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
```

**Step 2: Create SidebarNav component**

Create `components/SidebarNav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULE_META, type ModuleSlug } from "@/lib/constants";
import type { LessonMeta } from "@/lib/mdx";

interface SidebarNavProps {
  modules: {
    slug: ModuleSlug;
    lessons: LessonMeta[];
  }[];
}

export function SidebarNav({ modules }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {modules.map(({ slug, lessons }) => {
        const meta = MODULE_META[slug];
        return (
          <div key={slug}>
            <Link
              href={`/learn/${slug}`}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-primary transition-colors mb-2"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {meta.title}
            </Link>
            <ul className="space-y-0.5 ml-4 border-l border-border pl-3">
              {lessons.map((lesson) => {
                const href = `/learn/${slug}/${lesson.slug}`;
                const isActive = pathname === href;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={href}
                      className={`block text-sm py-1 transition-colors ${
                        isActive
                          ? "text-electric-500 font-medium"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {lesson.frontmatter.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
```

**Step 3: Create Sidebar component**

Create `components/Sidebar.tsx`:

```tsx
import { getLessonsByModule } from "@/lib/mdx";
import { MODULE_META, type ModuleSlug } from "@/lib/constants";
import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  const moduleSlugs = Object.keys(MODULE_META) as ModuleSlug[];

  const modules = moduleSlugs
    .map((slug) => ({
      slug,
      lessons: getLessonsByModule(slug),
    }))
    .filter(({ lessons }) => lessons.length > 0);

  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-border overflow-y-auto p-6">
      <SidebarNav modules={modules} />
    </aside>
  );
}
```

**Step 4: Create the learn layout**

Create `app/learn/layout.tsx`:

```tsx
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-8 py-10 max-w-4xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Step 5: Create learn index page**

Create `app/learn/page.tsx`:

```tsx
import Link from "next/link";
import { MODULE_META, type ModuleSlug } from "@/lib/constants";
import { getLessonsByModule } from "@/lib/mdx";

export default function LearnPage() {
  const moduleSlugs = Object.keys(MODULE_META) as ModuleSlug[];

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
        Learning Path
      </h1>
      <p className="text-text-secondary mb-8 text-lg">
        From prompts to systems. Master intent engineering one module at a time.
      </p>

      <div className="grid gap-4">
        {moduleSlugs.map((slug) => {
          const meta = MODULE_META[slug];
          const lessons = getLessonsByModule(slug);
          const hasContent = lessons.length > 0;

          return (
            <Link
              key={slug}
              href={hasContent ? `/learn/${slug}` : "#"}
              className={`card-gradient-border block p-6 ${
                hasContent ? "hover:bg-surface-overlay" : "opacity-50 cursor-not-allowed"
              } transition-colors`}
            >
              <div className="flex items-start gap-4">
                <span
                  className="mt-1 h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-text-primary">
                      Module {meta.order}: {meta.title}
                    </h2>
                    {!hasContent && (
                      <span className="text-xs bg-surface-overlay text-text-muted px-2 py-0.5 rounded-full">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted mt-0.5">{meta.subtitle}</p>
                  <p className="text-sm text-text-secondary mt-2">{meta.description}</p>
                  {hasContent && (
                    <p className="text-xs text-text-muted mt-2">{lessons.length} lessons</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 6: Verify layout renders**

Run: `npm run dev` — navigate to `/learn`.
Expected: TopBar with logo and nav links, sidebar with Module 1 lesson, module cards in main area.

**Step 7: Commit**

```bash
git add components/TopBar.tsx components/Sidebar.tsx components/SidebarNav.tsx app/learn/layout.tsx app/learn/page.tsx
git commit -m "feat: add layout shell with TopBar, Sidebar, and learn overview"
```

---

### Task 6: Dynamic Lesson Pages

**Files:**
- Create: `app/learn/[module]/page.tsx`, `app/learn/[module]/[slug]/page.tsx`, `components/LessonNav.tsx`

**Step 1: Create module index page**

Create `app/learn/[module]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { MODULE_META, type ModuleSlug } from "@/lib/constants";
import { getLessonsByModule } from "@/lib/mdx";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: moduleSlug } = await params;

  if (!(moduleSlug in MODULE_META)) notFound();

  const meta = MODULE_META[moduleSlug as ModuleSlug];
  const lessons = getLessonsByModule(moduleSlug);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: meta.color }}
        />
        <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
          Module {meta.order}
        </p>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-1">
        {meta.title}
      </h1>
      <p className="text-lg text-text-secondary mb-8">{meta.subtitle}</p>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.slug}
            href={`/learn/${moduleSlug}/${lesson.slug}`}
            className="block card-gradient-border p-5 hover:bg-surface-overlay transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="text-sm font-mono text-text-muted mt-0.5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-semibold text-text-primary">
                  {lesson.frontmatter.title}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {lesson.frontmatter.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Create lesson navigation component**

Create `components/LessonNav.tsx`:

```tsx
import Link from "next/link";
import type { LessonMeta } from "@/lib/mdx";

interface LessonNavProps {
  moduleSlug: string;
  prev: LessonMeta | null;
  next: LessonMeta | null;
}

export function LessonNav({ moduleSlug, prev, next }: LessonNavProps) {
  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
      {prev ? (
        <Link
          href={`/learn/${moduleSlug}/${prev.slug}`}
          className="text-sm text-text-secondary hover:text-electric-500 transition-colors"
        >
          &larr; {prev.frontmatter.title}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/learn/${moduleSlug}/${next.slug}`}
          className="text-sm text-text-secondary hover:text-electric-500 transition-colors"
        >
          {next.frontmatter.title} &rarr;
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
```

**Step 3: Create individual lesson page**

Create `app/learn/[module]/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { MODULE_META, type ModuleSlug } from "@/lib/constants";
import { getLesson, getLessonsByModule } from "@/lib/mdx";
import { LessonNav } from "@/components/LessonNav";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; slug: string }>;
}) {
  const { module: moduleSlug, slug } = await params;

  if (!(moduleSlug in MODULE_META)) notFound();

  const lesson = await getLesson(moduleSlug, slug);
  if (!lesson) notFound();

  const meta = MODULE_META[moduleSlug as ModuleSlug];
  const allLessons = getLessonsByModule(moduleSlug);
  const currentIndex = allLessons.findIndex((l) => l.slug === slug);
  const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <article>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: meta.color }}
          />
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
            {meta.title} &middot; Lesson {currentIndex + 1}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
          {lesson.frontmatter.title}
        </h1>
        <p className="text-lg text-text-secondary">
          {lesson.frontmatter.description}
        </p>
      </div>

      <div className="prose-workshop">
        {lesson.content}
      </div>

      <LessonNav moduleSlug={moduleSlug} prev={prev} next={next} />
    </article>
  );
}
```

**Step 4: Verify navigation works**

Run: `npm run dev` — navigate `/learn` → click Module 1 → click Lesson 1.
Expected: Lesson renders with MDX content, breadcrumb shows module + lesson number.

**Step 5: Commit**

```bash
git add app/learn/[module]/page.tsx app/learn/[module]/[slug]/page.tsx components/LessonNav.tsx
git commit -m "feat: add dynamic lesson and module index pages with navigation"
```

---

### Task 7: SkillAnatomyExplorer Interactive Component

**Files:**
- Create: `components/interactive/SkillAnatomyExplorer.tsx`

**Step 1: Build the SkillAnatomyExplorer component**

Create `components/interactive/SkillAnatomyExplorer.tsx`:

```tsx
"use client";

import { useState } from "react";

interface AnnotatedSection {
  id: string;
  label: string;
  lines: string;
  explanation: string;
  highlight: string; // Tailwind border color class
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
```

**Step 2: Register component for MDX usage**

Update `lib/mdx.ts` — add to the `getMDXComponents()` function's return object:

```typescript
// Add this import at the top of lib/mdx.ts
import { SkillAnatomyExplorer } from "@/components/interactive/SkillAnatomyExplorer";

// Add to the return object in getMDXComponents():
SkillAnatomyExplorer,
```

**Step 3: Verify component renders**

Add `<SkillAnatomyExplorer />` to the placeholder MDX file and check it renders in the browser.

**Step 4: Commit**

```bash
git add components/interactive/SkillAnatomyExplorer.tsx lib/mdx.ts
git commit -m "feat: add SkillAnatomyExplorer interactive component"
```

---

### Task 8: Module 1 Content — Three Lessons

**Files:**
- Modify: `content/learn/foundations/01-what-are-skills.mdx`
- Create: `content/learn/foundations/02-anatomy-of-a-skill.mdx`, `content/learn/foundations/03-trigger-descriptions.mdx`

**Step 1: Write Lesson 1 — "What Are Skills?"**

Replace `content/learn/foundations/01-what-are-skills.mdx` with full content covering:
- The problem skills solve (LLMs are general-purpose, skills make them specialized)
- The intent engineering hierarchy (prompt → skill → orchestration → intent engineering)
- The progressive disclosure model (3 layers: metadata → SKILL.md → resources)
- Real-world analogy: skills are like onboarding guides for a new hire
- Why this matters for SEs: consistent, repeatable AI-assisted workflows

Content should be ~800-1200 words of educational material written in a clear, engaging style. Include code examples showing the 3-layer model.

**Step 2: Write Lesson 2 — "Anatomy of a Skill"**

Create `content/learn/foundations/02-anatomy-of-a-skill.mdx` covering:
- SKILL.md structure (frontmatter + body)
- Frontmatter fields (name, description, version)
- Body content guidelines (imperative form, target word count)
- The `references/`, `scripts/`, `assets/` directories
- Include the `<SkillAnatomyExplorer />` component inline
- An exercise: "identify the parts of this skill and explain what each does"

Content ~800-1200 words plus the interactive component.

**Step 3: Write Lesson 3 — "Trigger Descriptions"**

Create `content/learn/foundations/03-trigger-descriptions.mdx` covering:
- Why the description field is the most important part
- Good vs. bad description examples
- Third-person writing style requirement
- How to identify trigger phrases (think about what users actually say)
- Testing trigger effectiveness
- Common mistakes (vague descriptions, wrong person, no specific phrases)
- Exercise: "Write a trigger description for an SE skill that helps prepare demo environments"

Content ~800-1200 words with good/bad comparison code blocks.

**Step 4: Verify all three lessons render**

Run: `npm run dev` — navigate through all 3 lessons.
Expected: Content renders with proper typography, code blocks have syntax highlighting, SkillAnatomyExplorer works in Lesson 2.

**Step 5: Commit**

```bash
git add content/learn/foundations/
git commit -m "feat: add Module 1 content — 3 lessons on skill foundations"
```

---

### Task 9: Reference Section — Glossary

**Files:**
- Create: `content/reference/glossary.mdx`, `app/reference/page.tsx`, `app/reference/[slug]/page.tsx`, `app/reference/layout.tsx`

**Step 1: Create reference layout**

Create `app/reference/layout.tsx`:

```tsx
import { TopBar } from "@/components/TopBar";

export default function ReferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <main className="max-w-4xl mx-auto px-8 py-10">
        {children}
      </main>
    </div>
  );
}
```

**Step 2: Create reference index page**

Create `app/reference/page.tsx`:

```tsx
import Link from "next/link";
import { getReferenceSlugs } from "@/lib/mdx";

const REFERENCE_META: Record<string, { title: string; description: string }> = {
  glossary: {
    title: "Glossary",
    description: "Key terms and definitions for intent engineering.",
  },
};

export default function ReferencePage() {
  const slugs = getReferenceSlugs();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
        Reference
      </h1>
      <p className="text-text-secondary mb-8 text-lg">
        Quick-access guides, templates, and definitions.
      </p>

      <div className="grid gap-4">
        {slugs.map((slug) => {
          const meta = REFERENCE_META[slug] ?? {
            title: slug,
            description: "",
          };
          return (
            <Link
              key={slug}
              href={`/reference/${slug}`}
              className="card-gradient-border block p-5 hover:bg-surface-overlay transition-colors"
            >
              <h2 className="font-semibold text-text-primary">{meta.title}</h2>
              {meta.description && (
                <p className="text-sm text-text-secondary mt-1">
                  {meta.description}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 3: Create reference detail page**

Create `app/reference/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getReferencePage } from "@/lib/mdx";

export default async function ReferenceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getReferencePage(slug);

  if (!page) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
        {page.frontmatter.title}
      </h1>
      {page.frontmatter.description && (
        <p className="text-lg text-text-secondary mb-8">
          {page.frontmatter.description}
        </p>
      )}
      <div className="prose-workshop">{page.content}</div>
    </article>
  );
}
```

**Step 4: Write glossary content**

Create `content/reference/glossary.mdx` with definitions for:
- Skill, SKILL.md, Frontmatter, Progressive Disclosure, Trigger Description
- Orchestration, Workflow, Handoff, Routing
- Intent Engineering, CLAUDE.md, Human-in-the-Loop
- Agent, Command, Hook, Plugin, MCP Server

Each term: name, definition (1-2 sentences), and a brief example where helpful.

**Step 5: Verify reference pages**

Run: `npm run dev` — navigate to `/reference` and `/reference/glossary`.
Expected: Reference index shows glossary link, glossary page renders with definitions.

**Step 6: Commit**

```bash
git add content/reference/ app/reference/
git commit -m "feat: add reference section with glossary"
```

---

### Task 10: Landing Page

**Files:**
- Modify: `app/page.tsx`
- Create: `components/landing/HeroSection.tsx`, `components/landing/LayerDiagram.tsx`, `components/landing/ModuleCards.tsx`

**Step 1: Create LayerDiagram component**

Create `components/landing/LayerDiagram.tsx` — a static SVG/CSS diagram showing the 4 layers of intent engineering stacking up:

```tsx
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
    description: "Packaging domain knowledge + workflows",
    color: "var(--color-mod-foundations)",
    href: "/learn/foundations",
    width: "55%",
  },
  {
    id: "orchestration",
    label: "Orchestration",
    description: "Composing skills with routing and state",
    color: "var(--color-mod-orchestration)",
    href: "/learn/orchestration",
    width: "70%",
  },
  {
    id: "intent",
    label: "Intent Engineering",
    description: "Full system design — the complete picture",
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

      {/* Dotted connector lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ display: "none" }} // Static v1 — enable for animated version
      />
    </div>
  );
}
```

**Step 2: Create HeroSection**

Create `components/landing/HeroSection.tsx`:

```tsx
import Link from "next/link";
import { LayerDiagram } from "./LayerDiagram";

export function HeroSection() {
  return (
    <section className="relative bg-blueprint min-h-[80vh] flex items-center">
      <div className="max-w-6xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
            From prompts
            <br />
            <span className="text-electric-500">to systems.</span>
          </h1>
          <p className="text-lg text-text-secondary mt-6 max-w-lg">
            A hands-on guide for sales engineers building AI-powered workflows.
            Learn to create skills, compose orchestrations, and design complete
            intent engineering systems.
          </p>
          <div className="flex gap-4 mt-8">
            <Link
              href="/learn/foundations/01-what-are-skills"
              className="inline-flex items-center gap-2 rounded-lg bg-electric-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-electric-400 transition-colors"
            >
              Start Learning
              <span aria-hidden>&rarr;</span>
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
            >
              View Curriculum
            </Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <LayerDiagram />
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Create ModuleCards**

Create `components/landing/ModuleCards.tsx`:

```tsx
import Link from "next/link";
import { MODULE_META, type ModuleSlug } from "@/lib/constants";
import { getLessonsByModule } from "@/lib/mdx";

export function ModuleCards() {
  const moduleSlugs = Object.keys(MODULE_META) as ModuleSlug[];

  return (
    <section className="max-w-6xl mx-auto px-8 py-20">
      <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-2">
        The Learning Path
      </h2>
      <p className="text-text-secondary mb-8">
        Four modules that take you from understanding skills to designing
        complete intent systems.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {moduleSlugs.map((slug) => {
          const meta = MODULE_META[slug];
          const lessons = getLessonsByModule(slug);
          const hasContent = lessons.length > 0;

          return (
            <Link
              key={slug}
              href={hasContent ? `/learn/${slug}` : "#"}
              className={`card-gradient-border p-6 ${
                hasContent ? "hover:bg-surface-overlay" : "opacity-50 cursor-not-allowed"
              } transition-colors`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.order}
                </span>
                <div>
                  <h3 className="font-semibold text-text-primary">{meta.title}</h3>
                  <p className="text-xs text-text-muted">{meta.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary">{meta.description}</p>
              <div className="mt-3 text-xs text-text-muted">
                {hasContent ? `${lessons.length} lessons` : "Coming soon"}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```

**Step 4: Assemble landing page**

Replace `app/page.tsx`:

```tsx
import { TopBar } from "@/components/TopBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ModuleCards } from "@/components/landing/ModuleCards";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <HeroSection />
      <ModuleCards />
    </div>
  );
}
```

**Step 5: Verify landing page**

Run: `npm run dev` — navigate to `/`.
Expected: Hero section with tagline and layer diagram, module cards below. Dark mode works. Links navigate to `/learn` and `/learn/foundations/01-what-are-skills`.

**Step 6: Commit**

```bash
git add app/page.tsx components/landing/
git commit -m "feat: add landing page with hero, layer diagram, and module cards"
```

---

### Task 11: Build Verification & Deploy

**Files:**
- None created — verification only

**Step 1: Run production build**

Run: `npm run build`
Expected: Build completes without errors. All pages statically generated or server-rendered.

**Step 2: Fix any build errors**

Address TypeScript errors, missing imports, or SSR issues.

**Step 3: Test locally with production build**

Run: `npm run start`
Navigate through all pages: `/`, `/learn`, `/learn/foundations`, `/learn/foundations/01-what-are-skills`, `/learn/foundations/02-anatomy-of-a-skill`, `/learn/foundations/03-trigger-descriptions`, `/reference`, `/reference/glossary`.

**Step 4: Deploy to Vercel**

Run: `vercel` (or use Vercel skill if configured)

**Step 5: Final commit if any fixes were made**

```bash
git add -A
git commit -m "fix: resolve build issues for production deployment"
```

---

## Task Summary

| Task | Description | Key Deliverable |
|------|-------------|-----------------|
| 1 | Project Scaffolding | Next.js 15 + MDX + Tailwind v4 project |
| 2 | Design Tokens | Color system, typography, blueprint grid |
| 3 | Root Layout | Fonts, ThemeProvider, dark mode toggle |
| 4 | MDX Pipeline | Content loading, frontmatter, syntax highlighting |
| 5 | Layout Shell | TopBar, Sidebar, learn overview page |
| 6 | Dynamic Pages | Module index + lesson pages with navigation |
| 7 | SkillAnatomyExplorer | Interactive annotated skill file viewer |
| 8 | Module 1 Content | 3 full lessons on skill foundations |
| 9 | Reference Section | Glossary with key terms |
| 10 | Landing Page | Hero, layer diagram, module cards |
| 11 | Build & Deploy | Production verification, Vercel deployment |
