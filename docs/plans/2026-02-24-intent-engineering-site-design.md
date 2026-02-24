# Intent Engineering Learning Site — Design Document

**Date:** 2026-02-24
**Project:** The Intent Workshop
**Status:** Approved

## Overview

An interactive web application that teaches sales engineers how to build AI-powered workflows using Claude Code's skill/orchestration/intent engineering stack. The site serves as both a structured onboarding curriculum and an ongoing reference tool.

## Audience

Sales engineers at the company. The goal is to enable the SE team to adopt AI-assisted workflows and build their own skills for automating common SE tasks: demo/POC prep, technical discovery, RFP/proposal responses, and post-call artifacts.

## Core Concept: Intent Engineering Hierarchy

The site teaches a specific progression:

1. **Prompt Engineering** — Crafting individual messages
2. **Skill Engineering** — Packaging domain knowledge + workflows for reliable agent steering
3. **Orchestration** — Composing skills/agents with routing, handoffs, and state
4. **Intent Engineering** — Full system design: goals, constraints, memory, tools, human-in-the-loop, evaluation

## Content Architecture (4 Modules)

### Module 1: Foundations — "What Are Skills?"
- What skills are and why they exist (progressive disclosure model)
- Anatomy of a SKILL.md (frontmatter, body, resources)
- How trigger descriptions work
- **Interactive:** SkillAnatomyExplorer — annotated real skill file
- **Exercise:** Deconstruct an existing skill

### Module 2: Building Skills — "From Idea to Skill"
- The 6-step skill creation process
- Writing effective descriptions and trigger phrases
- Progressive disclosure: SKILL.md vs. references/ vs. scripts/
- **Interactive:** SkillBuilder — form/editor with live validation
- **Exercise:** Build a simple SE skill

### Module 3: Orchestration — "Composing Skills Into Workflows"
- Routing, handoffs, state, multi-agent patterns
- Claude Code primitives: skills, commands, agents, hooks, plugins
- Multi-step workflow design
- **Interactive:** OrchestrationFlowEditor — visual step editor
- **Exercise:** Design an SE orchestration workflow

### Module 4: Intent Engineering — "Designing the Full System"
- Intent engineering as system design
- CLAUDE.md as the "operating system" for intent
- Human-in-the-loop design patterns
- Evaluation and feedback loops
- **Interactive:** IntentDesignCanvas — structured design template
- **Exercise:** Design a full intent system for the SE role

### Reference Section
- Glossary of terms
- Skill template library
- SE-specific skill examples

## Technical Architecture

### Stack
- **Framework:** Next.js 15 (App Router)
- **Content:** MDX via @next/mdx or next-mdx-remote
- **Styling:** Tailwind CSS v4
- **Interactive components:** React
- **Deployment:** Vercel

### Route Structure

```
/                              Landing page
/learn                         Curriculum overview
/learn/foundations              Module 1 index
/learn/foundations/[slug]       Module 1 lessons
/learn/building-skills          Module 2 index
/learn/building-skills/[slug]   Module 2 lessons
/learn/orchestration            Module 3 index
/learn/orchestration/[slug]     Module 3 lessons
/learn/intent-engineering       Module 4 index
/learn/intent-engineering/[slug] Module 4 lessons
/playground                    Sandbox (skill builder, prompt tester)
/reference                     Glossary, templates, examples
/reference/[slug]              Individual reference pages
```

### Content Structure

```
content/
  learn/
    foundations/
      01-what-are-skills.mdx
      02-anatomy-of-a-skill.mdx
      03-trigger-descriptions.mdx
    building-skills/
      01-creation-process.mdx
      ...
    orchestration/
      ...
    intent-engineering/
      ...
  reference/
    glossary.mdx
    templates.mdx
    se-examples.mdx
```

### Interactive Components

1. **SkillAnatomyExplorer** — Renders a SKILL.md with clickable annotations
2. **SkillBuilder** — Form with live preview, validates against best practices
3. **OrchestrationFlowEditor** — Step-based workflow editor with visual output
4. **IntentDesignCanvas** — Structured form for designing intent systems
5. **CodePlayground** — Monaco/CodeMirror editor for YAML/Markdown

## Visual Identity: "The Intent Workshop"

### Design Concept
Engineering workshop/lab aesthetic — the place where SEs build and refine AI tools.

### Color Palette
- **Base:** Deep navy/slate
- **Primary accent:** Electric blue
- **Secondary accent:** Warm amber
- **Module colors:**
  - Foundations: Blue
  - Building Skills: Green
  - Orchestration: Amber
  - Intent Engineering: Purple

### Typography
- **Body:** Geometric sans-serif (Inter or Geist)
- **Code/technical:** Monospace (JetBrains Mono or Geist Mono)

### Visual Language
- Blueprint/schematic-style illustrations
- Dotted connection lines between components
- Node-based diagrams
- Subtle grid patterns in backgrounds
- Cards with gradient borders
- Interactive components have a "workshop bench" feel

### Iconography
- Skill = puzzle piece
- Orchestration = flow diagram
- Intent = compass/target

### Landing Page
- Animated intent system diagram that builds layer by layer
- Each layer links to its module
- Tagline: "From prompts to systems."

### Dark Mode
Supported from the start.

## UI/UX

### Layout
- Left sidebar: module tree with progress indicators
- Main area: MDX content with inline interactive components
- Top bar: logo, search, playground, reference links
- Mobile: collapsible sidebar, full-width content

### Progress Tracking
- Per-lesson "Mark Complete" action
- Module completion percentages on index pages
- Visual progress map on /learn overview
- localStorage for v1

## Phasing

### Phase 1: Foundation (Current)
- Next.js scaffolding with MDX pipeline
- Design system components
- Landing page (static layered diagram)
- Sidebar navigation
- Module 1: 3 lessons with full content
- SkillAnatomyExplorer component
- Reference glossary
- Dark mode
- Vercel deployment

### Phase 2: Building & Interactivity
- Module 2 content
- SkillBuilder component
- CodePlayground component
- Progress tracking
- Search
- Landing page animation

### Phase 3: Orchestration & Advanced
- Module 3 content
- OrchestrationFlowEditor
- Module 4 content
- IntentDesignCanvas
- SE skill template library

### Phase 4: Polish & Scale
- Backend progress tracking
- Team collaboration
- Content contribution workflow
- Analytics
