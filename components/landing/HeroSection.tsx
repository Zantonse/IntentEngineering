import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero/hero-bg.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-surface/70 dark:bg-surface/80" />

      <div className="relative z-10 max-w-3xl mx-auto px-8 py-24 text-center">
        {/* Badge */}
        <span className="inline-flex items-center rounded-full border border-border bg-surface-raised/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-text-secondary mb-6">
          For Sales Engineers
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-text-primary leading-tight">
          Turn Claude Code
          <br />
          <span className="text-electric-500">into your SE agent.</span>
        </h1>

        <p className="text-lg text-text-secondary mt-6 max-w-xl mx-auto">
          Skills give your agent domain expertise. Orchestration makes it
          autonomous. Intent engineering makes it accountable. A hands-on
          guide for sales engineers building specialized AI agents with
          Claude Code.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/learn/foundations/01-what-are-skills"
            className="inline-flex items-center gap-2 rounded-lg bg-electric-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-electric-400 transition-colors shadow-sm"
          >
            Start Learning
            <span aria-hidden>&rarr;</span>
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised/80 backdrop-blur-sm px-6 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
          >
            View Curriculum
          </Link>
        </div>
      </div>
    </section>
  );
}
