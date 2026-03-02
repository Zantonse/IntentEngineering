"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MODULE_META, type ModuleSlug } from "@/lib/constants";
import type { LessonMeta } from "@/lib/mdx";

interface SidebarNavProps {
  modules: {
    slug: ModuleSlug;
    lessons: LessonMeta[];
  }[];
}

export function SidebarNav({ modules }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {modules.map(({ slug, lessons }) => {
        const meta = MODULE_META[slug];
        return (
          <div key={slug}>
            <Link
              href={`/learn/${slug}`}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-primary transition-colors mb-2"
            >
              <Image src={`/images/sidebar/${slug}.png`} alt="" width={24} height={24} className="rounded" />
              {meta.title}
            </Link>
            <ul className="space-y-0.5 ml-4 border-l border-border pl-3">
              {lessons.map((lesson) => {
                const href = `/learn/${slug}/${lesson.slug}`;
                const isActive = pathname === href;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={href}
                      className={`block text-sm py-1.5 transition-colors ${
                        isActive
                          ? "font-medium text-text-primary border-l-2 -ml-[calc(0.75rem+1px)] pl-[calc(0.75rem-1px)]"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                      style={isActive ? { borderColor: meta.color } : undefined}
                    >
                      {lesson.frontmatter.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
