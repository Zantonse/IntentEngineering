import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-8 py-10 max-w-4xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
