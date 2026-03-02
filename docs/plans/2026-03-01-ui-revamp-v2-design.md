# The Intent Workshop v2 — UI Revamp Design

**Date:** 2026-03-01
**Project:** The Intent Workshop
**Status:** Approved
**Supersedes:** Visual identity section of `2026-02-24-intent-engineering-site-design.md`

## Overview

Full visual overhaul of The Intent Workshop, shifting from the dark "engineering workshop" aesthetic to a premium SaaS/editorial design. Light-primary, typographically strong, with pervasive Gemini-generated abstract imagery throughout every surface of the site.

**Skills used:**
- `/gemini-image-gen` — All generated visual assets (~69 images)
- `/frontend-design` — Component and layout implementation

## Visual Direction

**Reference sites:** Linear.app, Stripe Docs, Resend.com

Light, airy canvas with generous whitespace. Gemini-generated images serve as atmospheric section art — abstract, gradient-rich, almost painterly. Content stays typographically clean while images create emotional texture. The interactive components (SkillBuilder, OrchestrationFlowEditor, etc.) remain the functional heroes.

## 1. Color System

### Light Mode (Default)

| Token | Value | Usage |
|-------|-------|-------|
| `canvas` | `#FAFBFC` | Page background |
| `surface` | `#FFFFFF` | Cards, elevated containers |
| `surface-raised` | `#FFFFFF` + stronger shadow | Hover/active cards |
| `text-primary` | `#111827` | Headings, body text |
| `text-secondary` | `#6B7280` | Descriptions, meta |
| `text-muted` | `#9CA3AF` | Timestamps, hints |
| `border` | `#E5E7EB` | Standard borders |
| `border-subtle` | `#F3F4F6` | Light dividers |

### Dark Mode (Secondary)

| Token | Value |
|-------|-------|
| `canvas` | `#0C0F1A` |
| `surface` | `#151926` |
| `surface-raised` | `#1E2333` |
| `text-primary` | `#E4E8EF` |
| `text-secondary` | `#A8B2C4` |
| `text-muted` | `#6B7589` |
| `border` | `#2A3557` |
| `border-subtle` | `#1E2844` |

### Module Colors (Unchanged)

| Module | Accent | Light tint (bg) | Dark variant (text-on-light) |
|--------|--------|-----------------|------------------------------|
| Foundations | `#3b82f6` | `#EFF6FF` | `#2563EB` |
| Building Skills | `#22c55e` | `#F0FDF4` | `#16A34A` |
| Orchestration | `#f59e0b` | `#FFFBEB` | `#D97706` |
| Intent Engineering | `#a855f7` | `#FAF5FF` | `#9333EA` |
| Building Your SE Agent | `#ef4444` | `#FEF2F2` | `#DC2626` |

### Card Styling

Replace `card-gradient-border` pseudo-element with clean shadow system:
- Default: `box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)`
- Hover: `box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)` + slight translateY(-1px)
- `border-radius: 12px` stays

## 2. Typography

**Fonts:** Geist Sans + Geist Mono (no change)

| Element | Size | Weight | Tracking | Line Height |
|---------|------|--------|----------|-------------|
| Hero heading | 3.5rem (56px) | 700 | -0.02em | 1.1 |
| Section heading (h2) | 2.25rem (36px) | 700 | -0.015em | 1.2 |
| Card heading (h3) | 1.25rem (20px) | 600 | normal | 1.3 |
| Body | 1rem (16px) | 400 | normal | 1.75 |
| Small/meta | 0.875rem (14px) | 500 | 0.025em (uppercase) | 1.5 |
| Code blocks | 0.875rem | 400 | normal | 1.6 |

**Code theme:** `github-light-default` for light mode, `github-dark-default` for dark mode.

## 3. Spacing

- **Base unit:** 4px
- **Common increments:** 4, 8, 12, 16, 24, 32, 48, 64, 96
- **Section vertical padding:** 96px
- **Card internal padding:** 24px
- **Max content width (landing):** 1152px
- **Max content width (lessons):** max-w-4xl (896px, unchanged)
- **Sidebar width:** 280px (from 256px)
- **Paragraph spacing:** 24px
- **Heading top margin:** 48px, bottom margin: 16px

## 4. Landing Page

### Hero Section
- **Full-width** centered layout (replaces current 2-column)
- Large Gemini-generated abstract background (blue/purple gradient light refractions, 1920x800)
- Semi-transparent overlay for text readability
- Small pill badge above headline: "For Sales Engineers"
- Headline: "Turn Claude Code into your SE agent." (unchanged)
- Subtext + dual CTAs centered
- Layer Diagram removed from hero

### Layer Diagram Section
- Standalone section below hero
- Light background with subtle Gemini-generated texture
- Interactive pyramid with softer colors, border-glow hover states
- Same 4-layer structure and behavior

### Module Cards Section
- 2-column grid on desktop (5 cards, last one spans or centered)
- Each card: Gemini-generated header image (abstract in module color) -> Module badge -> Title -> Subtitle -> Lesson count
- Clean white cards with shadow (no gradient border)
- Horizontal scroll on mobile

### "Why This Course" Section
- 3-column grid: "Hands-on" / "SE-specific" / "From prompts to systems"
- Each has small Gemini-generated icon (200x200)
- Brief explanatory text

### Footer
- Dark section with "Built with Claude Code" + Anthropic link
- Resource links

## 5. Learn Pages

### Sidebar
- White background, subtle right border
- Module sections with Gemini-generated 32x32 icons
- Active lesson: left border accent in module color + bold text
- Increased vertical padding on lesson links
- Mobile: full-screen slide-in drawer with backdrop blur

### Lesson Pages
- **Header banner:** Thin (100px) Gemini-generated atmospheric image, tinted to module color, full-width
- **Breadcrumb trail:** "Module 2 > Building Skills > Lesson 3" above title
- **Title treatment:** Large heading + reading time badge + module color indicator
- **Table of Contents:** Lighter typography, subtle left border, dot indicators
- **Content styling:**
  - Code blocks: light mode theme (`github-light-default`)
  - Callouts: softer pastel backgrounds, 1px left border, refined icons
  - Interactive components: card wrapper with subtle shadow, "Interactive Exercise" badge
- **Prev/Next navigation:** Larger cards showing next lesson title + Gemini-generated thumbnail

### Module Index Pages
- Module hero banner (Gemini-generated, 1200x300)
- Module description
- Grid of lesson cards with small header images

## 6. Reference Pages

### Reference Index
- 3 cards: Glossary, SE Skill Library, MCP Guide
- Each with distinct Gemini-generated header image (600x300)
- Larger card format with description + "last updated" metadata

### Reference Content
- Similar to lessons but neutral header (no color tint)
- Table of Contents on right side (desktop) instead of sticky left

## 7. Component Updates

| Component | Change |
|-----------|--------|
| `Callout` | Softer pastel bg, refined icon, 1px left border (from 4px) |
| `Details` | Smooth expand animation, card wrapper |
| `KeyTakeaways` | White card, subtle shadow, checkmark icon list (drop gradient border) |
| `KnowledgeCheck` | Card wrapper, smooth reveal animation, success/error colors |
| `SelfAssessment` | Progress-bar style confidence tracker |
| `GlossaryTerm` | Softer tooltip styling |
| `SearchDialog` | Larger result cards, keyboard hint styling |
| Interactive exercises | Card container + subtle Gemini bg texture + "Interactive Exercise" badge |

## 8. Gemini Image Manifest

### Landing Page (7 images)
1. Hero background — abstract light refractions, blue/purple, 1920x800
2. Layer Diagram section bg — subtle texture, 1920x400
3. "Why This Course" icon: Hands-on — 200x200
4. "Why This Course" icon: SE-specific — 200x200
5. "Why This Course" icon: From prompts to systems — 200x200
6-7. Decorative section dividers — 1920x100

### Module Cards (5 images)
8-12. Abstract art in module color palette, 600x300

### Module Index Banners (5 images)
13-17. Wider module art for index headers, 1200x300

### Lesson Header Banners (20 images)
18-37. Thin atmospheric banners per lesson, module-tinted, 1200x150

### Sidebar Module Icons (5 images)
38-42. Small abstract icons per module, 64x64

### Reference Page Cards (3 images)
43-45. Glossary / SE Skill Library / MCP Guide headers, 600x300

### Interactive Exercise Textures (4 images)
46-49. Subtle card bg textures for each interactive component, 800x100

### Prev/Next Lesson Thumbnails (20 images)
50-69. Small thumbnails for navigation cards, 200x120

**Total: 69 images**

### Image Prompt Strategy
- Base style: "premium SaaS, clean, abstract, soft gradients, light background, subtle, professional, no text"
- Module-specific: add dominant color tone
- Consistent aspect ratios within each category
- All images should work on both light and dark backgrounds (or generate dark variants for dark mode hero/banners)

## 9. Dark Mode Considerations

- All semantic tokens remap via `.dark` class (existing pattern)
- Generated images for hero/banners may need darker variants or CSS overlay treatment
- `mix-blend-mode` or `opacity` adjustments on images in dark mode
- Code blocks switch to `github-dark-default` theme

## 10. Implementation Order

1. Design tokens + globals.css overhaul
2. Generate all Gemini images (batch process)
3. Landing page (Hero, LayerDiagram, ModuleCards, WhyThisCourse, Footer)
4. TopBar + Sidebar redesign
5. Lesson page layout + header banners + breadcrumbs
6. Module index pages
7. Reference pages
8. Component library updates (Callout, Details, KeyTakeaways, etc.)
9. Interactive exercise wrappers
10. Prev/next navigation with thumbnails
11. Dark mode pass (verify all surfaces + image treatments)
12. Mobile responsive pass
13. Search dialog refinement
