import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import { getLessonsByModule } from "@/lib/mdx";
import { MODULE_META, type ModuleSlug } from "@/lib/constants";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const moduleSlugs = Object.keys(MODULE_META) as ModuleSlug[];
  const modules = moduleSlugs
    .map((slug) => ({ slug, lessons: getLessonsByModule(slug) }))
    .filter(({ lessons }) => lessons.length > 0);

  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-8 py-10 max-w-4xl mx-auto">
          {children}
        </main>
      </div>
      <MobileSidebar modules={modules} />
    </div>
  );
}
