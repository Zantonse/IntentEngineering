# UI Revamp v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform The Intent Workshop from a dark "engineering workshop" aesthetic to a premium SaaS/editorial design with light-primary mode and ~69 Gemini-generated images.

**Architecture:** Overhaul `globals.css` design tokens, then work surface-by-surface: landing page, learn layout (sidebar + lessons), reference pages, and component library. Gemini image generation runs as a batch task first so images are available for all subsequent layout work. The `/frontend-design` skill guides each component implementation. The `/gemini-image-gen` skill handles all image generation.

**Tech Stack:** Next.js 16, Tailwind CSS v4 (CSS-native `@theme`), Geist fonts, `rehype-pretty-code` (dual themes), Gemini image generation

**Design doc:** `docs/plans/2026-03-01-ui-revamp-v2-design.md`

---

## Phase 1: Foundation (Design Tokens + Image Generation)

### Task 1: Overhaul Design Tokens in globals.css

**Files:**
- Modify: `app/globals.css`

**Step 1: Update light mode semantic tokens**

Replace the current `@theme` block's semantic tokens with the new v2 palette. The canvas shifts from white to `#FAFBFC`, text tokens get warmer near-black, and new module tint tokens are added.

Replace the `/* Semantic tokens */` section in `@theme` with:
```css
/* Semantic tokens (light default) */
--color-surface: #fafbfc;
--color-surface-raised: #ffffff;
--color-surface-overlay: #f9fafb;
--color-text-primary: #111827;
--color-text-secondary: #6b7280;
--color-text-muted: #9ca3af;
--color-border: #e5e7eb;
--color-border-subtle: #f3f4f6;

/* Module tints (light backgrounds) */
--color-mod-foundations-tint: #eff6ff;
--color-mod-building-tint: #f0fdf4;
--color-mod-orchestration-tint: #fffbeb;
--color-mod-intent-tint: #faf5ff;
--color-mod-practice-tint: #fef2f2;

/* Module dark variants (text on light) */
--color-mod-foundations-dark: #2563eb;
--color-mod-building-dark: #16a34a;
--color-mod-orchestration-dark: #d97706;
--color-mod-intent-dark: #9333ea;
--color-mod-practice-dark: #dc2626;
```

**Step 2: Update dark mode overrides**

Replace the `.dark { }` block with:
```css
.dark {
  --color-surface: #0c0f1a;
  --color-surface-raised: #151926;
  --color-surface-overlay: #1e2333;
  --color-text-primary: #e4e8ef;
  --color-text-secondary: #a8b2c4;
  --color-text-muted: #6b7589;
  --color-border: #2a3557;
  --color-border-subtle: #1e2844;

  --color-mod-foundations-tint: rgba(59, 130, 246, 0.08);
  --color-mod-building-tint: rgba(34, 197, 94, 0.08);
  --color-mod-orchestration-tint: rgba(245, 158, 11, 0.08);
  --color-mod-intent-tint: rgba(168, 85, 247, 0.08);
  --color-mod-practice-tint: rgba(239, 68, 68, 0.08);

  --color-mod-foundations-dark: #60a5fa;
  --color-mod-building-dark: #4ade80;
  --color-mod-orchestration-dark: #fbbf24;
  --color-mod-intent-dark: #c084fc;
  --color-mod-practice-dark: #f87171;
}
```

**Step 3: Replace card-gradient-border with card-v2 utility**

Remove the `.card-gradient-border` and `.card-gradient-border::before` blocks. Add:
```css
/* v2 card styling */
.card-v2 {
  position: relative;
  border-radius: 12px;
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border-subtle);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}

.card-v2:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}
```

**Step 4: Add body canvas background**

Update the `body` rule to use `--color-surface` (it already does, but the token changed value).

No additional change needed — `body { background-color: var(--color-surface); }` already exists and will pick up the new `#fafbfc`.

**Step 5: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds. Pages may look slightly different but nothing breaks.

**Step 6: Commit**

```bash
git add app/globals.css
git commit -m "style: overhaul design tokens for v2 light-primary theme"
```

---

### Task 2: Generate All Gemini Images

**Files:**
- Create: `public/images/` directory structure
- Create: `scripts/image-prompts.ts` (prompt manifest for reference)

This task uses the `/gemini-image-gen` skill to generate all ~69 images. Images are saved to `public/images/` organized by category.

**Step 1: Create directory structure**

```bash
mkdir -p public/images/{hero,modules,lessons,sidebar,reference,interactive,nav,dividers,icons}
```

**Step 2: Generate landing page hero image**

Use `/gemini-image-gen` with prompt:
> "Abstract premium SaaS hero background, soft light refractions, layered translucent blue and purple gradients, clean and modern, no text, no icons, horizontal composition, light background fading to white at edges"

Save as: `public/images/hero/hero-bg.png` (1920x800)

**Step 3: Generate Layer Diagram section background**

Prompt: "Subtle abstract texture, very light blue geometric pattern, premium SaaS background, barely visible grid, clean modern, no text"

Save as: `public/images/hero/layer-diagram-bg.png` (1920x400)

**Step 4: Generate "Why This Course" icons (3 images)**

Prompts:
1. "Abstract hands building with light, premium icon, soft blue gradient, clean modern, 3D glass morphism style, no text" → `public/images/icons/hands-on.png` (200x200)
2. "Abstract briefcase with target overlay, premium icon, soft blue gradient, clean modern, 3D glass morphism style, no text" → `public/images/icons/se-specific.png` (200x200)
3. "Abstract layered stack growing upward, premium icon, soft gradient blue to purple, clean modern, 3D glass morphism style, no text" → `public/images/icons/prompts-to-systems.png` (200x200)

**Step 5: Generate section dividers (2 images)**

Prompt: "Horizontal gradient transition, soft abstract blend of light blue to transparent, subtle premium divider, no text"

Save as: `public/images/dividers/divider-1.png` and `divider-2.png` (1920x100)

**Step 6: Generate module card images (5 images)**

Prompts for each module — all share base: "Abstract premium SaaS illustration, soft gradients, clean modern, no text, horizontal card composition"

1. Foundations (blue): + "flowing blue light refractions, puzzle-like structures" → `public/images/modules/foundations-card.png` (600x300)
2. Building Skills (green): + "organic green growth patterns, constructing elements" → `public/images/modules/building-skills-card.png`
3. Orchestration (amber): + "dynamic amber energy flows, connected nodes" → `public/images/modules/orchestration-card.png`
4. Intent Engineering (purple): + "deep purple layered architecture, compass-like forms" → `public/images/modules/intent-engineering-card.png`
5. Building Your SE Agent (red): + "bold red launching energy, assembled components" → `public/images/modules/building-your-agent-card.png`

**Step 7: Generate module index banners (5 images)**

Same prompts as Step 6 but wider: 1200x300. Add "wide panoramic composition" to each.

Save as: `public/images/modules/foundations-banner.png`, etc.

**Step 8: Generate lesson header banners (20 images)**

Each lesson gets a thin atmospheric banner. Share the module's base color. Add lesson-specific subtle variation.

Base prompt per module + "thin horizontal banner, atmospheric, abstract" + unique detail per lesson.

Save as: `public/images/lessons/{module-slug}/{lesson-slug}.png` (1200x150)

Full list:
- `foundations/01-what-are-skills.png` through `03-trigger-descriptions.png` (3)
- `building-skills/01-skill-creation-process.png` through `05-using-skill-creator.png` (5)
- `orchestration/01-what-is-orchestration.png` through `03-orchestration-patterns.png` (3)
- `intent-engineering/01-the-intent-engineering-stack.png` through `04-evaluation-and-system-design.png` (4)
- `building-your-agent/01-designing-your-skill-library.png` through `05-exercise-building-a-verification-skill.png` (5)

**Step 9: Generate sidebar module icons (5 images)**

Prompt per module: "Tiny abstract icon, {module color} gradient, minimalist, premium, no text, simple geometric form"

Save as: `public/images/sidebar/foundations.png`, etc. (64x64)

**Step 10: Generate reference page card images (3 images)**

1. "Abstract dictionary/book form, soft gradient, premium, no text" → `public/images/reference/glossary.png` (600x300)
2. "Abstract toolbox with organized compartments, soft gradient, premium, no text" → `public/images/reference/se-skill-library.png`
3. "Abstract connected nodes network, soft gradient, premium, no text" → `public/images/reference/mcp-integration-guide.png`

**Step 11: Generate interactive exercise textures (4 images)**

Prompt: "Extremely subtle abstract texture, barely visible soft gradient pattern, premium SaaS background, {component color}, no text"

Save as:
- `public/images/interactive/skill-anatomy.png` (800x100)
- `public/images/interactive/skill-builder.png`
- `public/images/interactive/orchestration-flow.png`
- `public/images/interactive/intent-architect.png`

**Step 12: Generate prev/next lesson thumbnails (20 images)**

Small versions of the lesson header banners, cropped tighter. Can reuse/resize lesson banners.

Save as: `public/images/nav/{module-slug}/{lesson-slug}.png` (200x120)

**Step 13: Create image prompt manifest**

Create `scripts/image-prompts.ts` documenting all prompts used for reproducibility. This is a reference file, not a runnable script.

**Step 14: Commit all generated images**

```bash
git add public/images/ scripts/image-prompts.ts
git commit -m "assets: generate v2 UI images via Gemini"
```

---

## Phase 2: Landing Page

### Task 3: Redesign HeroSection Component

**Files:**
- Modify: `components/landing/HeroSection.tsx`

**Step 1: Rewrite HeroSection with centered layout and background image**

Use `/frontend-design` skill. Replace the current two-column grid with a centered hero featuring the Gemini-generated background image.

Replace the entire component with:
```tsx
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero/hero-bg.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-surface/70 dark:bg-surface/80" />

      <div className="relative z-10 max-w-3xl mx-auto px-8 py-24 text-center">
        {/* Badge */}
        <span className="inline-flex items-center rounded-full border border-border bg-surface-raised/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-text-secondary mb-6">
          For Sales Engineers
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-text-primary leading-tight">
          Turn Claude Code
          <br />
          <span className="text-electric-500">into your SE agent.</span>
        </h1>

        <p className="text-lg text-text-secondary mt-6 max-w-xl mx-auto">
          Skills give your agent domain expertise. Orchestration makes it
          autonomous. Intent engineering makes it accountable. A hands-on
          guide for sales engineers building specialized AI agents with
          Claude Code.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/learn/foundations/01-what-are-skills"
            className="inline-flex items-center gap-2 rounded-lg bg-electric-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-electric-400 transition-colors shadow-sm"
          >
            Start Learning
            <span aria-hidden>&rarr;</span>
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised/80 backdrop-blur-sm px-6 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
          >
            View Curriculum
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Verify it renders**

Run: `npm run dev` and visit `http://localhost:3000`
Expected: Centered hero with background image, badge, headline, description, and CTAs.

**Step 3: Commit**

```bash
git add components/landing/HeroSection.tsx
git commit -m "feat: redesign hero section with centered layout and background image"
```

---

### Task 4: Add LayerDiagram Section with Background

**Files:**
- Modify: `components/landing/LayerDiagram.tsx`
- Modify: `app/page.tsx`

**Step 1: Update LayerDiagram with softer v2 styling**

Update the component to use softer colors and a subtle glow hover effect. Replace the current inline styles approach with v2 card styling.

In `LayerDiagram.tsx`, update the `className` and `style` on each layer's `<Link>`:
- Remove: `scale-105 shadow-lg` on hover
- Add: `shadow-md ring-1 ring-{color}/20` on hover via style
- Update background from `surface-raised` to `surface` (white in light mode)
- Add `border-2` instead of `border`

**Step 2: Wrap LayerDiagram in its own section in page.tsx**

Update `app/page.tsx` to:
```tsx
import { TopBar } from "@/components/TopBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { LayerDiagram } from "@/components/landing/LayerDiagram";
import { ModuleCards } from "@/components/landing/ModuleCards";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <HeroSection />

      {/* Layer Diagram Section */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="/images/hero/layer-diagram-bg.png"
          alt=""
          fill
          className="object-cover opacity-30 dark:opacity-15"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-8">
          <h2 className="text-2xl md:text-[2.25rem] font-bold tracking-tight text-text-primary text-center mb-2">
            The Intent Engineering Stack
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-lg mx-auto">
            Four layers of capability, each building on the last.
          </p>
          <LayerDiagram />
        </div>
      </section>

      <ModuleCards />
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add components/landing/LayerDiagram.tsx app/page.tsx
git commit -m "feat: extract LayerDiagram into standalone section with background"
```

---

### Task 5: Redesign ModuleCards with Generated Art

**Files:**
- Modify: `components/landing/ModuleCards.tsx`

**Step 1: Rewrite ModuleCards with image headers and v2 card styling**

Use `/frontend-design` skill. Replace `card-gradient-border` with image-topped cards.

Add a `cardImage` mapping in the component (or derive from slug) that maps each module slug to its card image path: `public/images/modules/{slug}-card.png`.

Replace the card markup to:
```tsx
<Link
  key={slug}
  href={hasContent ? `/learn/${slug}` : "#"}
  className={`card-v2 overflow-hidden ${
    hasContent ? "" : "opacity-50 cursor-not-allowed"
  }`}
>
  {/* Card image header */}
  <div className="relative h-40 w-full overflow-hidden">
    <Image
      src={`/images/modules/${slug}-card.png`}
      alt=""
      fill
      className="object-cover"
    />
  </div>
  <div className="p-6">
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
  </div>
</Link>
```

Add `import Image from "next/image";` at the top.

**Step 2: Commit**

```bash
git add components/landing/ModuleCards.tsx
git commit -m "feat: redesign module cards with generated art headers"
```

---

### Task 6: Add WhyThisCourse Section

**Files:**
- Create: `components/landing/WhyThisCourse.tsx`
- Modify: `app/page.tsx`

**Step 1: Create the WhyThisCourse component**

Use `/frontend-design` skill. Three-column value proposition section.

```tsx
import Image from "next/image";

const VALUE_PROPS = [
  {
    image: "/images/icons/hands-on.png",
    title: "Hands-On",
    description:
      "Every module includes interactive exercises — build real skills, test orchestration flows, and design intent systems in your browser.",
  },
  {
    image: "/images/icons/se-specific.png",
    title: "SE-Specific",
    description:
      "Built for sales engineers. Discovery calls, demo prep, RFP responses, and follow-up — the skills you actually need.",
  },
  {
    image: "/images/icons/prompts-to-systems.png",
    title: "From Prompts to Systems",
    description:
      "Progress from writing single prompts to designing full agent systems — with accountability, memory, and evaluation built in.",
  },
];

export function WhyThisCourse() {
  return (
    <section className="py-24 bg-surface-raised">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-2xl md:text-[2.25rem] font-bold tracking-tight text-text-primary text-center mb-12">
          Why This Course
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image
                  src={prop.image}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                {prop.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Add WhyThisCourse to page.tsx**

Import and place between ModuleCards and the end of the page.

**Step 3: Commit**

```bash
git add components/landing/WhyThisCourse.tsx app/page.tsx
git commit -m "feat: add WhyThisCourse value proposition section"
```

---

### Task 7: Add Footer Component

**Files:**
- Create: `components/Footer.tsx`
- Modify: `app/page.tsx`

**Step 1: Create the Footer component**

Use `/frontend-design` skill. Dark footer with "Built with Claude Code" branding.

```tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy-950 dark:bg-[#080a14] text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-electric-500">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span>The Intent Workshop</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/learn" className="hover:text-slate-200 transition-colors">
              Learn
            </Link>
            <Link href="/reference" className="hover:text-slate-200 transition-colors">
              Reference
            </Link>
            <a
              href="https://www.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors"
            >
              Built with Claude Code
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Add Footer to page.tsx after WhyThisCourse**

**Step 3: Commit**

```bash
git add components/Footer.tsx app/page.tsx
git commit -m "feat: add site footer component"
```

---

## Phase 3: Navigation (TopBar + Sidebar)

### Task 8: Redesign TopBar

**Files:**
- Modify: `components/TopBar.tsx`

**Step 1: Update TopBar styling for v2**

Use `/frontend-design` skill. Key changes:
- Background: `bg-surface/90` with slightly stronger blur
- Border: keep bottom border but make it `border-border-subtle`
- Height: increase from `h-14` to `h-16`
- Add slightly more horizontal padding
- Logo SVG stays the same
- Nav links get slightly more spacing

Replace `h-14` with `h-16`, `bg-surface/80` with `bg-surface/90`, `border-border` with `border-border-subtle`, `px-6` with `px-8`.

**Step 2: Commit**

```bash
git add components/TopBar.tsx
git commit -m "style: refine TopBar for v2 theme"
```

---

### Task 9: Redesign Sidebar with Module Icons

**Files:**
- Modify: `components/Sidebar.tsx`
- Modify: `components/SidebarNav.tsx`

**Step 1: Update Sidebar container**

In `Sidebar.tsx`:
- Change width from `w-64` to `w-[280px]`
- Remove `border-r border-border` — replace with `border-r border-border-subtle`
- Add `bg-surface` explicitly (transparent on light, surface on dark)

**Step 2: Update SidebarNav with module icons and active border**

In `SidebarNav.tsx`:
- Replace the `h-2 w-2 rounded-full` color dot with a 32x32 `<Image>` from `public/images/sidebar/{slug}.png`
- Change active lesson style from `text-electric-500 font-medium` to include a left border in the module's color
- Add more vertical padding to lesson links (`py-1.5` instead of `py-1`)
- Import `Image from "next/image"`

For the module title row, replace:
```tsx
<span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
```
With:
```tsx
<Image src={`/images/sidebar/${slug}.png`} alt="" width={24} height={24} className="rounded" />
```

For active state, replace:
```tsx
isActive ? "text-electric-500 font-medium" : "text-text-secondary hover:text-text-primary"
```
With:
```tsx
isActive
  ? "font-medium text-text-primary border-l-2 -ml-[calc(0.75rem+1px)] pl-[calc(0.75rem-1px)]"
  : "text-text-secondary hover:text-text-primary"
```
And set the border color dynamically using a style prop: `style={isActive ? { borderColor: MODULE_META[moduleSlug].color } : undefined}` where `moduleSlug` is passed from the parent loop.

Note: The `modules` prop already passes `slug` (a `ModuleSlug`), so you can access the color directly.

**Step 3: Commit**

```bash
git add components/Sidebar.tsx components/SidebarNav.tsx
git commit -m "feat: redesign sidebar with module icons and active border accent"
```

---

### Task 10: Add Mobile Sidebar Drawer

**Files:**
- Modify: `components/Sidebar.tsx` (or create `components/MobileSidebar.tsx`)
- Modify: `app/learn/layout.tsx`
- Modify: `components/TopBar.tsx`

**Step 1: Create mobile sidebar drawer**

Create a client component `MobileSidebar.tsx` that:
- Renders a hamburger button (visible below `lg` breakpoint)
- When clicked, slides in a full-screen sidebar from the left
- Uses `backdrop-blur-sm` and `bg-black/30` overlay
- Closes on navigation (listens to `pathname` changes)
- Reuses `SidebarNav` for content

**Step 2: Add hamburger button to TopBar (mobile only)**

Add a `lg:hidden` hamburger icon to the left side of the TopBar that triggers the mobile sidebar.

**Step 3: Wire MobileSidebar into learn layout**

Import and render `MobileSidebar` in `app/learn/layout.tsx`.

**Step 4: Commit**

```bash
git add components/MobileSidebar.tsx components/TopBar.tsx app/learn/layout.tsx
git commit -m "feat: add mobile sidebar drawer with backdrop blur"
```

---

## Phase 4: Learn Pages

### Task 11: Add Lesson Header Banners

**Files:**
- Modify: `app/learn/[module]/[slug]/page.tsx`

**Step 1: Add header banner image to lesson pages**

Add an `Image` import and a banner div at the top of the `<article>` before the current header content:

```tsx
<article>
  {/* Lesson header banner */}
  <div className="relative -mx-8 -mt-10 mb-8 h-[100px] overflow-hidden rounded-b-lg">
    <Image
      src={`/images/lessons/${moduleSlug}/${slug}.png`}
      alt=""
      fill
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface" />
  </div>

  {/* ... existing header content ... */}
</article>
```

Note: The negative margins (`-mx-8 -mt-10`) extend the banner to the full width of the content area. The gradient overlay ensures the image fades cleanly into the content.

**Step 2: Add breadcrumb trail**

Before the existing module dot + label, add a breadcrumb:

```tsx
<nav className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
  <Link href="/learn" className="hover:text-text-secondary transition-colors">
    Learn
  </Link>
  <span>/</span>
  <Link href={`/learn/${moduleSlug}`} className="hover:text-text-secondary transition-colors">
    {meta.title}
  </Link>
  <span>/</span>
  <span className="text-text-secondary">Lesson {currentIndex + 1}</span>
</nav>
```

Add `import Link from "next/link";` and `import Image from "next/image";`.

**Step 3: Commit**

```bash
git add app/learn/[module]/[slug]/page.tsx
git commit -m "feat: add lesson header banners and breadcrumb navigation"
```

---

### Task 12: Redesign LessonNav (Prev/Next)

**Files:**
- Modify: `components/LessonNav.tsx`

**Step 1: Rewrite LessonNav as larger cards with thumbnails**

Use `/frontend-design` skill. Replace the simple text links with card-style navigation.

```tsx
import Link from "next/link";
import Image from "next/image";
import type { LessonMeta } from "@/lib/mdx";

interface LessonNavProps {
  moduleSlug: string;
  prev: LessonMeta | null;
  next: LessonMeta | null;
}

export function LessonNav({ moduleSlug, prev, next }: LessonNavProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-border">
      {prev ? (
        <Link
          href={`/learn/${moduleSlug}/${prev.slug}`}
          className="card-v2 p-4 flex items-center gap-4 group"
        >
          <div className="relative w-16 h-12 rounded-md overflow-hidden shrink-0">
            <Image
              src={`/images/nav/${moduleSlug}/${prev.slug}.png`}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-text-muted">Previous</span>
            <p className="text-sm font-medium text-text-primary group-hover:text-electric-500 transition-colors truncate">
              {prev.frontmatter.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/learn/${moduleSlug}/${next.slug}`}
          className="card-v2 p-4 flex items-center gap-4 group sm:flex-row-reverse sm:text-right"
        >
          <div className="relative w-16 h-12 rounded-md overflow-hidden shrink-0">
            <Image
              src={`/images/nav/${moduleSlug}/${next.slug}.png`}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-text-muted">Next</span>
            <p className="text-sm font-medium text-text-primary group-hover:text-electric-500 transition-colors truncate">
              {next.frontmatter.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/LessonNav.tsx
git commit -m "feat: redesign lesson navigation as cards with thumbnails"
```

---

### Task 13: Redesign Module Index Pages

**Files:**
- Modify: `app/learn/[module]/page.tsx`

**Step 1: Add module banner and update lesson cards**

Add a Gemini-generated banner at the top and update lesson cards from `card-gradient-border` to `card-v2`.

At the top of the return:
```tsx
{/* Module banner */}
<div className="relative -mx-8 -mt-10 mb-8 h-[150px] overflow-hidden rounded-b-lg">
  <Image
    src={`/images/modules/${moduleSlug}-banner.png`}
    alt=""
    fill
    className="object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface" />
</div>
```

Replace `card-gradient-border` with `card-v2` on lesson cards.

Add `import Image from "next/image";`.

**Step 2: Commit**

```bash
git add "app/learn/[module]/page.tsx"
git commit -m "feat: redesign module index with banner and v2 cards"
```

---

## Phase 5: Reference Pages

### Task 14: Redesign Reference Index

**Files:**
- Modify: `app/reference/page.tsx`

**Step 1: Add image headers to reference cards**

Replace `card-gradient-border` with `card-v2` + image headers. For each reference slug, map to its image at `public/images/reference/{slug}.png`.

```tsx
<Link
  key={slug}
  href={`/reference/${slug}`}
  className="card-v2 block overflow-hidden"
>
  <div className="relative h-32 w-full overflow-hidden">
    <Image
      src={`/images/reference/${slug}.png`}
      alt=""
      fill
      className="object-cover"
    />
  </div>
  <div className="p-5">
    <h2 className="font-semibold text-text-primary">{meta.title}</h2>
    {meta.description && (
      <p className="text-sm text-text-secondary mt-1">
        {meta.description}
      </p>
    )}
  </div>
</Link>
```

Add `import Image from "next/image";`.

**Step 2: Commit**

```bash
git add app/reference/page.tsx
git commit -m "feat: redesign reference index with image headers"
```

---

## Phase 6: Component Library Updates

### Task 15: Update Callout Component

**Files:**
- Modify: `components/learn/Callout.tsx`

**Step 1: Soften callout styling**

Change border from `border-l-4` to `border-l-2`. Change background opacity from `/5` to `/3` for lighter pastel effect. Replace emoji icons with clean SVG icons.

Update `CALLOUT_CONFIG`:
```tsx
const CALLOUT_CONFIG = {
  key: {
    borderColor: "border-l-electric-500",
    bgColor: "bg-electric-500/3",
    label: "Key Concept",
  },
  tip: {
    borderColor: "border-l-mod-building",
    bgColor: "bg-mod-building/3",
    label: "Tip",
  },
  warning: {
    borderColor: "border-l-amber-500",
    bgColor: "bg-amber-500/3",
    label: "Warning",
  },
  example: {
    borderColor: "border-l-mod-intent",
    bgColor: "bg-mod-intent/3",
    label: "Example",
  },
};
```

Replace the emoji `<span>{config.icon}</span>` with SVG icons:
- key: lightbulb SVG
- tip: checkmark-circle SVG
- warning: exclamation-triangle SVG
- example: document-text SVG

Change outer div from `border-l-4` to `border-l-2`.

**Step 2: Commit**

```bash
git add components/learn/Callout.tsx
git commit -m "style: soften callout component for v2 theme"
```

---

### Task 16: Update Details Component

**Files:**
- Modify: `components/learn/Details.tsx`

**Step 1: Add v2 card wrapper and smooth animation**

Replace `border border-border bg-surface-raised` with `card-v2`. The `.card-v2` class already provides the shadow and border.

Add a smooth expand/collapse by wrapping the content in a div with CSS `grid-template-rows` animation:

```css
/* In globals.css */
details[open] .details-content {
  grid-template-rows: 1fr;
}
.details-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
}
.details-content > div {
  overflow: hidden;
}
```

Update the component to use `.details-content` wrapper around the content div.

**Step 2: Add the CSS to globals.css**

**Step 3: Commit**

```bash
git add components/learn/Details.tsx app/globals.css
git commit -m "style: update Details component with v2 card and smooth animation"
```

---

### Task 17: Update KeyTakeaways Component

**Files:**
- Modify: `components/learn/KeyTakeaways.tsx`

**Step 1: Replace gradient border with v2 card**

Change from `card-gradient-border` to `card-v2`. Replace bullet dots with checkmark icons.

Replace:
```tsx
<div className="card-gradient-border my-8 px-6 py-5">
```
With:
```tsx
<div className="card-v2 my-8 px-6 py-5">
```

Replace the bullet dot with a checkmark:
```tsx
<span className="mt-1.5 shrink-0 text-electric-500">
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
</span>
```

**Step 2: Commit**

```bash
git add components/learn/KeyTakeaways.tsx
git commit -m "style: update KeyTakeaways to v2 card with checkmarks"
```

---

### Task 18: Update KnowledgeCheck Component

**Files:**
- Modify: `components/learn/KnowledgeCheck.tsx`

**Step 1: Update to v2 card styling**

Replace `rounded-lg border border-border bg-surface-raised` with `card-v2`. Keep the existing interactive logic unchanged — only update visual classes.

For the answer options, update border colors to use `border-border-subtle` default. On hover, use `hover:border-electric-400 hover:bg-electric-500/3` instead of `hover:border-electric-500/50`.

For the explanation reveal, add a smooth height animation using the same `grid-template-rows` technique as Details.

**Step 2: Commit**

```bash
git add components/learn/KnowledgeCheck.tsx
git commit -m "style: update KnowledgeCheck to v2 card styling"
```

---

### Task 19: Add Interactive Exercise Wrappers

**Files:**
- Modify: `lib/mdx.ts` (where `getMDXComponents` registers interactive components)

**Step 1: Wrap each interactive component in an exercise container**

In the MDX component map returned by `getMDXComponents()`, wrap each interactive component:

```tsx
SkillAnatomyExplorer: (props) => (
  <div className="my-8 card-v2 overflow-hidden">
    <div className="relative h-12 overflow-hidden">
      <Image src="/images/interactive/skill-anatomy.png" alt="" fill className="object-cover opacity-50" />
      <div className="absolute inset-0 flex items-center px-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Interactive Exercise</span>
      </div>
    </div>
    <div className="p-6">
      <SkillAnatomyExplorer {...props} />
    </div>
  </div>
),
```

Do the same for `SkillBuilder`, `OrchestrationFlowEditor`, and `IntentArchitectDesigner`.

Alternatively, create a reusable `InteractiveWrapper` component to avoid repetition.

**Step 2: Commit**

```bash
git add lib/mdx.ts
git commit -m "feat: add interactive exercise wrappers with generated textures"
```

---

## Phase 7: Code Syntax Theme + Dark Mode Pass

### Task 20: Add Light Mode Code Theme

**Files:**
- Modify: `lib/mdx.ts` (where `rehype-pretty-code` is configured)

**Step 1: Update rehype-pretty-code config for dual themes**

The current config uses `github-dark-default`. Change to support both light and dark themes using `rehype-pretty-code`'s multi-theme support:

```ts
rehypePrettyCode, {
  theme: {
    light: "github-light-default",
    dark: "github-dark-default",
  },
}
```

This generates both theme variants with `data-theme="light"` and `data-theme="dark"` attributes.

**Step 2: Add CSS to toggle themes based on dark class**

In `globals.css`:
```css
/* Code block theme switching */
[data-theme="dark"] { display: none; }
.dark [data-theme="light"] { display: none; }
.dark [data-theme="dark"] { display: block; }
```

**Step 3: Verify code blocks render correctly in both modes**

Run: `npm run dev`, navigate to any lesson with code blocks, toggle theme.
Expected: Code blocks switch between light and dark themes.

**Step 4: Commit**

```bash
git add lib/mdx.ts app/globals.css
git commit -m "feat: add light mode code theme with dark mode switching"
```

---

### Task 21: Dark Mode Image Treatments

**Files:**
- Modify: `app/globals.css`

**Step 1: Add dark mode image overlays**

Add CSS rules that apply a subtle overlay to generated images in dark mode:

```css
/* Dark mode image treatments */
.dark .hero-image {
  opacity: 0.6;
  filter: brightness(0.7) saturate(0.9);
}

.dark .lesson-banner {
  opacity: 0.5;
  filter: brightness(0.6);
}

.dark .card-image {
  filter: brightness(0.8) saturate(0.85);
}
```

Then add the corresponding class names to each image in the components that were updated:
- `HeroSection.tsx`: add `hero-image` class to the hero `<Image>`
- `LessonPage`: add `lesson-banner` class
- `ModuleCards.tsx`: add `card-image` class
- etc.

**Step 2: Commit**

```bash
git add app/globals.css components/landing/HeroSection.tsx app/learn/[module]/[slug]/page.tsx components/landing/ModuleCards.tsx
git commit -m "style: add dark mode treatments for generated images"
```

---

## Phase 8: Final Polish

### Task 22: Curriculum Overview Page Update

**Files:**
- Modify: `app/learn/page.tsx`

**Step 1: Read the current learn/page.tsx and update it**

Update the curriculum overview page to use `card-v2` instead of `card-gradient-border` for any cards, and add the module card images.

**Step 2: Commit**

```bash
git add app/learn/page.tsx
git commit -m "style: update curriculum overview with v2 cards"
```

---

### Task 23: Remove Blueprint Grid Pattern

**Files:**
- Modify: `app/globals.css`

**Step 1: Remove .bg-blueprint CSS class**

Remove both `.bg-blueprint` and `.dark .bg-blueprint` blocks from `globals.css`. The hero no longer uses this pattern.

**Step 2: Verify no other files reference bg-blueprint**

Search for `bg-blueprint` across the codebase. If found elsewhere, remove those references.

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "chore: remove deprecated blueprint grid pattern"
```

---

### Task 24: Update SearchDialog Styling

**Files:**
- Modify: `components/SearchDialog.tsx`

**Step 1: Read the current SearchDialog**

Examine the current styling and update to v2 aesthetic:
- Larger result cards
- Subtle shadow on the dialog itself
- Keyboard hint styling (lighter, rounded pill backgrounds)
- `card-v2` style for individual search results

**Step 2: Commit**

```bash
git add components/SearchDialog.tsx
git commit -m "style: refine search dialog for v2 theme"
```

---

### Task 25: Full Build Verification

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 2: Run dev server and visually inspect**

Run: `npm run dev`

Check each page:
- Landing page (hero, layer diagram, module cards, why this course, footer)
- Curriculum overview
- Module index pages (all 5)
- Sample lesson pages (one per module)
- Reference index
- Sample reference page
- Toggle dark/light mode on each
- Test mobile viewport (resize browser)

**Step 3: Fix any issues found**

Address styling bugs, broken image paths, or layout issues.

**Step 4: Final commit**

```bash
git add -A
git commit -m "fix: resolve remaining v2 styling issues"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-2 | Foundation: design tokens + Gemini images |
| 2 | 3-7 | Landing page: hero, diagram, cards, why, footer |
| 3 | 8-10 | Navigation: TopBar, sidebar, mobile drawer |
| 4 | 11-13 | Learn pages: banners, breadcrumbs, lesson nav, module index |
| 5 | 14 | Reference pages |
| 6 | 15-19 | Component library updates |
| 7 | 20-21 | Code themes + dark mode image treatments |
| 8 | 22-25 | Polish: curriculum, cleanup, search, verification |

**Total: 25 tasks across 8 phases**
