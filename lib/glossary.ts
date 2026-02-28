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
