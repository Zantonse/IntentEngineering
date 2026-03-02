import Image from "next/image";

const VALUE_PROPS = [
  {
    image: "/images/icons/hands-on.png",
    title: "Hands-On",
    description:
      "Every module includes interactive exercises — build real skills, test orchestration flows, and design intent systems in your browser.",
  },
  {
    image: "/images/icons/se-specific.png",
    title: "SE-Specific",
    description:
      "Built for sales engineers. Discovery calls, demo prep, RFP responses, and follow-up — the skills you actually need.",
  },
  {
    image: "/images/icons/prompts-to-systems.png",
    title: "From Prompts to Systems",
    description:
      "Progress from writing single prompts to designing full agent systems — with accountability, memory, and evaluation built in.",
  },
];

export function WhyThisCourse() {
  return (
    <section className="py-24 bg-surface-raised">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-2xl md:text-[2.25rem] font-bold tracking-tight text-text-primary text-center mb-12">
          Why This Course
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Image
                  src={prop.image}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                {prop.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
