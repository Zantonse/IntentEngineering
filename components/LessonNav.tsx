import Link from "next/link";
import Image from "next/image";
import type { LessonMeta } from "@/lib/mdx";

interface LessonNavProps {
  moduleSlug: string;
  prev: LessonMeta | null;
  next: LessonMeta | null;
}

export function LessonNav({ moduleSlug, prev, next }: LessonNavProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-border">
      {prev ? (
        <Link
          href={`/learn/${moduleSlug}/${prev.slug}`}
          className="card-v2 p-4 flex items-center gap-4 group"
        >
          <div className="relative w-16 h-12 rounded-md overflow-hidden shrink-0">
            <Image
              src={`/images/nav/${moduleSlug}/${prev.slug}.png`}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-text-muted">Previous</span>
            <p className="text-sm font-medium text-text-primary group-hover:text-electric-500 transition-colors truncate">
              {prev.frontmatter.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/learn/${moduleSlug}/${next.slug}`}
          className="card-v2 p-4 flex items-center gap-4 group sm:flex-row-reverse sm:text-right"
        >
          <div className="relative w-16 h-12 rounded-md overflow-hidden shrink-0">
            <Image
              src={`/images/nav/${moduleSlug}/${next.slug}.png`}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-text-muted">Next</span>
            <p className="text-sm font-medium text-text-primary group-hover:text-electric-500 transition-colors truncate">
              {next.frontmatter.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
