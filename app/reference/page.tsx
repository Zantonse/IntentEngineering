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
