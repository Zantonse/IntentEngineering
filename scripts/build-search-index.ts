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
