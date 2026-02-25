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
