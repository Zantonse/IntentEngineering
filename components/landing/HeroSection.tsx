import Link from "next/link";
import { LayerDiagram } from "./LayerDiagram";

export function HeroSection() {
  return (
    <section className="relative bg-blueprint min-h-[80vh] flex items-center">
      <div className="max-w-6xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
            Turn Claude Code
            <br />
            <span className="text-electric-500">into your SE agent.</span>
          </h1>
          <p className="text-lg text-text-secondary mt-6 max-w-lg">
            Skills give your agent domain expertise. Orchestration makes it
            autonomous. Intent engineering makes it accountable. A hands-on
            guide for sales engineers building specialized AI agents with
            Claude Code.
          </p>
          <div className="flex gap-4 mt-8">
            <Link
              href="/learn/foundations/01-what-are-skills"
              className="inline-flex items-center gap-2 rounded-lg bg-electric-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-electric-400 transition-colors"
            >
              Start Learning
              <span aria-hidden>&rarr;</span>
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
            >
              View Curriculum
            </Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <LayerDiagram />
        </div>
      </div>
    </section>
  );
}
