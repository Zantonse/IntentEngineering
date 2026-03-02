import { TopBar } from "@/components/TopBar";
import { HeroSection } from "@/components/landing/HeroSection";
import { LayerDiagram } from "@/components/landing/LayerDiagram";
import { ModuleCards } from "@/components/landing/ModuleCards";
import { WhyThisCourse } from "@/components/landing/WhyThisCourse";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <HeroSection />

      {/* Layer Diagram Section */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="/images/hero/layer-diagram-bg.png"
          alt=""
          fill
          className="object-cover opacity-30 dark:opacity-15"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-8">
          <h2 className="text-2xl md:text-[2.25rem] font-bold tracking-tight text-text-primary text-center mb-2">
            The Intent Engineering Stack
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-lg mx-auto">
            Four layers of capability, each building on the last.
          </p>
          <LayerDiagram />
        </div>
      </section>

      <ModuleCards />
      <WhyThisCourse />
      <Footer />
    </div>
  );
}
