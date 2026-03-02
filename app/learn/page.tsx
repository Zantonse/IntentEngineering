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
        Four modules from first principles to a deployed SE agent. Skills
        give it expertise. Orchestration gives it autonomy. Intent engineering
        makes it yours.
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
              className={`card-v2 block p-6 ${
                hasContent ? "" : "opacity-50 cursor-not-allowed"
              }`}
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
