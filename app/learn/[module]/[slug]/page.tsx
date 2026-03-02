import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
      {/* Lesson header banner */}
      <div className="relative -mx-8 -mt-10 mb-8 h-[100px] overflow-hidden rounded-b-lg">
        <Image
          src={`/images/lessons/${moduleSlug}/${slug}.png`}
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface" />
      </div>

      <div className="mb-8">
        {/* Breadcrumb trail */}
        <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
          <Link href="/learn" className="hover:text-text-secondary transition-colors">
            Learn
          </Link>
          <span>/</span>
          <Link href={`/learn/${moduleSlug}`} className="hover:text-text-secondary transition-colors">
            {meta.title}
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Lesson {currentIndex + 1}</span>
        </nav>

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
