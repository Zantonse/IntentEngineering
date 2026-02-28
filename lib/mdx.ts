import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import React from "react";
import { SkillAnatomyExplorer } from "@/components/interactive/SkillAnatomyExplorer";
import { SkillBuilder } from "@/components/interactive/SkillBuilder";
import { OrchestrationFlowEditor } from "@/components/interactive/OrchestrationFlowEditor";
import { IntentArchitectDesigner } from "@/components/interactive/IntentArchitectDesigner";
import { Callout } from "@/components/learn/Callout";
import { Details } from "@/components/learn/Details";
import { KeyTakeaways } from "@/components/learn/KeyTakeaways";

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
          rehypeSlug,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [rehypePrettyCode as any, { theme: "github-dark-default", keepBackground: true }],
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
          rehypeSlug,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [rehypePrettyCode as any, { theme: "github-dark-default", keepBackground: true }],
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
    h1: (props: React.ComponentProps<"h1">) =>
      React.createElement("h1", {
        className: "text-3xl font-bold tracking-tight text-text-primary mt-8 mb-4",
        ...props,
      }),
    h2: (props: React.ComponentProps<"h2">) =>
      React.createElement("h2", {
        className:
          "text-2xl font-semibold tracking-tight text-text-primary mt-8 mb-3 pb-2 border-b border-border",
        ...props,
      }),
    h3: (props: React.ComponentProps<"h3">) =>
      React.createElement("h3", {
        className: "text-xl font-semibold text-text-primary mt-6 mb-2",
        ...props,
      }),
    p: (props: React.ComponentProps<"p">) =>
      React.createElement("p", {
        className: "text-text-secondary leading-7 mb-4",
        ...props,
      }),
    ul: (props: React.ComponentProps<"ul">) =>
      React.createElement("ul", {
        className: "text-text-secondary leading-7 mb-4 ml-6 list-disc",
        ...props,
      }),
    ol: (props: React.ComponentProps<"ol">) =>
      React.createElement("ol", {
        className: "text-text-secondary leading-7 mb-4 ml-6 list-decimal",
        ...props,
      }),
    li: (props: React.ComponentProps<"li">) =>
      React.createElement("li", {
        className: "mb-1",
        ...props,
      }),
    code: (props: React.ComponentProps<"code">) =>
      React.createElement("code", {
        className: "bg-surface-overlay rounded px-1.5 py-0.5 font-mono text-sm text-electric-400",
        ...props,
      }),
    pre: (props: React.ComponentProps<"pre">) =>
      React.createElement("pre", {
        className: "rounded-lg border border-border overflow-x-auto mb-4",
        ...props,
      }),
    blockquote: (props: React.ComponentProps<"blockquote">) =>
      React.createElement("blockquote", {
        className: "border-l-4 border-electric-500 pl-4 my-4 text-text-muted italic",
        ...props,
      }),
    strong: (props: React.ComponentProps<"strong">) =>
      React.createElement("strong", {
        className: "font-semibold text-text-primary",
        ...props,
      }),
    SkillAnatomyExplorer,
    SkillBuilder,
    OrchestrationFlowEditor,
    IntentArchitectDesigner,
    Callout,
    Details,
    KeyTakeaways,
  };
}
