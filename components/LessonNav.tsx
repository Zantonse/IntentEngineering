import Link from "next/link";
import type { LessonMeta } from "@/lib/mdx";

interface LessonNavProps {
  moduleSlug: string;
  prev: LessonMeta | null;
  next: LessonMeta | null;
}

export function LessonNav({ moduleSlug, prev, next }: LessonNavProps) {
  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
      {prev ? (
        <Link
          href={`/learn/${moduleSlug}/${prev.slug}`}
          className="text-sm text-text-secondary hover:text-electric-500 transition-colors"
        >
          &larr; {prev.frontmatter.title}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/learn/${moduleSlug}/${next.slug}`}
          className="text-sm text-text-secondary hover:text-electric-500 transition-colors"
        >
          {next.frontmatter.title} &rarr;
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
