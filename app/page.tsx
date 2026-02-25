import { TopBar } from "@/components/TopBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ModuleCards } from "@/components/landing/ModuleCards";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <HeroSection />
      <ModuleCards />
    </div>
  );
}
