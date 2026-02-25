import { TopBar } from "@/components/TopBar";

export default function ReferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <main className="max-w-4xl mx-auto px-8 py-10">
        {children}
      </main>
    </div>
  );
}
