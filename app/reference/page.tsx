import Link from "next/link";
import Image from "next/image";
import { getReferenceSlugs } from "@/lib/mdx";

const REFERENCE_META: Record<string, { title: string; description: string }> = {
  glossary: {
    title: "Glossary",
    description: "Key terms and definitions for intent engineering.",
  },
  "se-skill-library": {
    title: "SE Skill Library Reference",
    description: "Complete taxonomy of SE skills — 15 skills across 4 tiers with design patterns, naming conventions, and directory structures.",
  },
  "mcp-integration-guide": {
    title: "MCP Integration Guide",
    description: "Connecting your SE agent to real tools — CRM, email, call recording, knowledge bases, and integration platforms.",
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
            <Link key={slug} href={`/reference/${slug}`} className="card-v2 block overflow-hidden">
              <div className="relative h-32 w-full overflow-hidden">
                <Image src={`/images/reference/${slug}.png`} alt="" fill className="object-cover" />
              </div>
              <div className="p-5">
                <h2 className="font-semibold text-text-primary">{meta.title}</h2>
                {meta.description && <p className="text-sm text-text-secondary mt-1">{meta.description}</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
