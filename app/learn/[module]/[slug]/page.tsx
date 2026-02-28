import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { MODULE_META, type ModuleSlug } from "@/lib/constants";
import { getLesson, getLessonsByModule, extractHeadings } from "@/lib/mdx";
import { LessonNav } from "@/components/LessonNav";
import { TableOfContents } from "@/components/learn/TableOfContents";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; slug: string }>;
}) {
  const { module: moduleSlug, slug } = await params;

  if (!(moduleSlug in MODULE_META)) notFound();

  const lesson = await getLesson(moduleSlug, slug);
  if (!lesson) notFound();

  const meta = MODULE_META[moduleSlug as ModuleSlug];
  const allLessons = getLessonsByModule(moduleSlug);
  const currentIndex = allLessons.findIndex((l) => l.slug === slug);
  const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Extract headings for table of contents
  const rawPath = path.join(process.cwd(), "content", "learn", moduleSlug, `${slug}.mdx`);
  const rawContent = fs.readFileSync(rawPath, "utf-8");
  const { content: rawBody } = matter(rawContent);
  const headings = extractHeadings(rawBody);

  return (
    <article>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: meta.color }}
          />
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
            {meta.title} &middot; Lesson {currentIndex + 1}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
          {lesson.frontmatter.title}
        </h1>
        <p className="text-lg text-text-secondary">
          {lesson.frontmatter.description}
        </p>
      </div>

      <TableOfContents headings={headings} />

      <div className="prose-workshop">
        {lesson.content}
      </div>

      <LessonNav moduleSlug={moduleSlug} prev={prev} next={next} />
    </article>
  );
}
