import Link from "next/link";
import { notFound } from "next/navigation";
import { MODULE_META, type ModuleSlug } from "@/lib/constants";
import { getLessonsByModule } from "@/lib/mdx";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: moduleSlug } = await params;

  if (!(moduleSlug in MODULE_META)) notFound();

  const meta = MODULE_META[moduleSlug as ModuleSlug];
  const lessons = getLessonsByModule(moduleSlug);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: meta.color }}
        />
        <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
          Module {meta.order}
        </p>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-1">
        {meta.title}
      </h1>
      <p className="text-lg text-text-secondary mb-8">{meta.subtitle}</p>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.slug}
            href={`/learn/${moduleSlug}/${lesson.slug}`}
            className="block card-gradient-border p-5 hover:bg-surface-overlay transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="text-sm font-mono text-text-muted mt-0.5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-semibold text-text-primary">
                  {lesson.frontmatter.title}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {lesson.frontmatter.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
