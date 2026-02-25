import { getLessonsByModule } from "@/lib/mdx";
import { MODULE_META, type ModuleSlug } from "@/lib/constants";
import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  const moduleSlugs = Object.keys(MODULE_META) as ModuleSlug[];

  const modules = moduleSlugs
    .map((slug) => ({
      slug,
      lessons: getLessonsByModule(slug),
    }))
    .filter(({ lessons }) => lessons.length > 0);

  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-border overflow-y-auto p-6">
      <SidebarNav modules={modules} />
    </aside>
  );
}
